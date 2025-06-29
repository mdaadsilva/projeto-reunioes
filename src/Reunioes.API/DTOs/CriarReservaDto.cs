using System;

namespace Reunioes.API.DTOs
{
    public class CriarReservaDto
    {
        public DateTime Inicio { get; set; }
        public DateTime Fim { get; set; }
        public int SalaId { get; set; }
    }
}