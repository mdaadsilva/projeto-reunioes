using Microsoft.AspNetCore.Mvc;
using NHibernate;
using NHibernate.Linq;
using Reunioes.API.DTOs;
using Reunioes.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Reunioes.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservasController : ControllerBase
    {
        private readonly NHibernate.ISession _session;

        public ReservasController(NHibernate.ISession session)
        {
            _session = session;
        }

        [HttpGet]
        public async Task<ActionResult<List<Reserva>>> ListarReservas()
        {
            var reservas = await _session.Query<Reserva>()
                                         .OrderBy(r => r.Inicio)
                                         .ToListAsync();
            return Ok(reservas);
        }

        [HttpGet("total-ultimos-7-dias")]
        public async Task<ActionResult<int>> TotalReservasUltimosSeteDias()
        {
            var hoje = DateTime.UtcNow;
            var seteDiasAtras = hoje.AddDays(-7);

            var total = await _session.Query<Reserva>()
                .CountAsync(r => r.Inicio >= seteDiasAtras && r.Inicio <= hoje);

            return Ok(total);
        }

        [HttpPost]
        public async Task<IActionResult> CriarReserva([FromBody] CriarReservaDto reservaDto)
        {
            if (reservaDto == null) return BadRequest();

            if (reservaDto.Inicio.Hour < 8 || reservaDto.Fim.Hour > 19)
            {
                return BadRequest("Só é permitido agendar horários entre 08h00 e 19h00.");
            }

            var conflito = await _session.Query<Reserva>()
                .AnyAsync(r => r.Sala != null && r.Sala.Id == reservaDto.SalaId && r.Inicio < reservaDto.Fim && reservaDto.Inicio < r.Fim);

            if (conflito)
            {
                return Conflict("Já existe uma reserva para esta sala neste intervalo de tempo.");
            }

            using (var transaction = _session.BeginTransaction())
            {
                var sala = await _session.GetAsync<Sala>(reservaDto.SalaId);
                if (sala == null)
                {
                    return BadRequest("A sala especificada não existe.");
                }

                var novaReserva = new Reserva
                {
                    Inicio = reservaDto.Inicio,
                    Fim = reservaDto.Fim,
                    Sala = sala
                };

                await _session.SaveAsync(novaReserva);
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(CriarReserva), new { id = novaReserva.Id }, novaReserva);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> ReagendarReserva(int id, [FromBody] CriarReservaDto reagendamentoDto)
        {
            if (reagendamentoDto == null) return BadRequest();

            using (var transaction = _session.BeginTransaction())
            {
                var reservaExistente = await _session.GetAsync<Reserva>(id);
                if (reservaExistente == null)
                {
                    return NotFound();
                }

                if (reservaExistente.Inicio < DateTime.UtcNow)
                {
                    return BadRequest("Não é possível reagendar reservas que já aconteceram.");
                }

                if (reagendamentoDto.Inicio.Hour < 8 || reagendamentoDto.Fim.Hour > 19)
                {
                    return BadRequest("Só é permitido agendar horários entre 08h00 e 19h00.");
                }

                var conflito = await _session.Query<Reserva>()
                    .AnyAsync(r => r.Id != id && r.Sala != null && r.Sala.Id == reagendamentoDto.SalaId && r.Inicio < reagendamentoDto.Fim && reagendamentoDto.Inicio < r.Fim);

                if (conflito)
                {
                    return Conflict("O novo horário conflita com outra reserva existente.");
                }

                var sala = await _session.GetAsync<Sala>(reagendamentoDto.SalaId);
                if (sala == null)
                {
                    return BadRequest("A sala especificada não existe.");
                }

                reservaExistente.Inicio = reagendamentoDto.Inicio;
                reservaExistente.Fim = reagendamentoDto.Fim;
                reservaExistente.Sala = sala;

                await _session.UpdateAsync(reservaExistente);
                await transaction.CommitAsync();

                return Ok(reservaExistente);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelarReserva(int id)
        {
            using (var transaction = _session.BeginTransaction())
            {
                var reserva = await _session.GetAsync<Reserva>(id);
                if (reserva == null)
                {
                    return NotFound();
                }

                await _session.DeleteAsync(reserva);
                await transaction.CommitAsync();

                return NoContent();
            }
        }
    }
}