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
    public class SalasController : ControllerBase
    {
        private readonly NHibernate.ISession _session;

        public SalasController(NHibernate.ISession session)
        {
            _session = session;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Sala>> BuscarSalaPorId(int id)
        {
            var sala = await _session.GetAsync<Sala>(id);
            if (sala == null)
            {
                return NotFound();
            }
            return Ok(sala);
        }

        [HttpGet("horas-livres")]
        public async Task<ActionResult<List<SalaHorasLivresDto>>> CalcularHorasLivres()
        {
            var hoje = DateTime.UtcNow.Date;
            var inicioDia = hoje.AddHours(8);
            var fimDia = hoje.AddHours(19);
            var totalHorasTrabalho = (fimDia - inicioDia).TotalHours;

            var salas = await _session.Query<Sala>().ToListAsync();
            var resultado = new List<SalaHorasLivresDto>();

            foreach (var sala in salas)
            {
                var reservasHoje = await _session.Query<Reserva>()
                    .Where(r => r.Sala != null && r.Sala.Id == sala.Id && r.Inicio >= inicioDia && r.Fim <= fimDia)
                    .ToListAsync();

                double horasReservadas = 0;
                foreach (var reserva in reservasHoje)
                {
                    horasReservadas += (reserva.Fim - reserva.Inicio).TotalHours;
                }

                var horasLivres = totalHorasTrabalho - horasReservadas;

                resultado.Add(new SalaHorasLivresDto
                {
                    SalaId = sala.Id,
                    NomeSala = sala.Nome ?? string.Empty,
                    HorasLivresHoje = horasLivres
                });
            }

            return Ok(resultado);
        }

        [HttpGet]
        public async Task<ActionResult<ResultadoPaginadoDto<Sala>>> ListarSalas([FromQuery] string? nome, [FromQuery] int pagina = 1, [FromQuery] int tamanhoPagina = 10)
        {
            var query = _session.Query<Sala>();

            if (!string.IsNullOrEmpty(nome))
            {
                query = query.Where(s => s.Nome != null && s.Nome.Contains(nome));
            }

            var totalItens = await query.CountAsync();

            var salasPaginadas = await query.OrderBy(s => s.Andar)
                                            .Skip((pagina - 1) * tamanhoPagina)
                                            .Take(tamanhoPagina)
                                            .ToListAsync();

            var resultado = new ResultadoPaginadoDto<Sala>
            {
                Itens = salasPaginadas,
                TotalItens = totalItens
            };

            return Ok(resultado);
        }

        [HttpPost]
        public async Task<IActionResult> CriarSala([FromBody] Sala novaSala)
        {
            if (novaSala == null)
            {
                return BadRequest();
            }

            using (var transaction = _session.BeginTransaction())
            {
                await _session.SaveAsync(novaSala);
                await transaction.CommitAsync();
            }

            return CreatedAtAction(nameof(CriarSala), new { id = novaSala.Id }, novaSala);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarSala(int id, [FromBody] Sala salaAtualizada)
        {
            if (salaAtualizada == null)
            {
                return BadRequest();
            }

            using (var transaction = _session.BeginTransaction())
            {
                var salaExistente = await _session.GetAsync<Sala>(id);

                if (salaExistente == null)
                {
                    return NotFound();
                }

                salaExistente.Nome = salaAtualizada.Nome;
                salaExistente.Andar = salaAtualizada.Andar;
                salaExistente.QuantidadeAssentos = salaAtualizada.QuantidadeAssentos;

                await _session.UpdateAsync(salaExistente);
                await transaction.CommitAsync();

                return Ok(salaExistente);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> ExcluirSala(int id)
        {
            using (var transaction = _session.BeginTransaction())
            {
                var sala = await _session.GetAsync<Sala>(id);
                if (sala == null)
                {
                    return NotFound();
                }

                await _session.DeleteAsync(sala);
                await transaction.CommitAsync();

                return NoContent();
            }
        }
    }
}