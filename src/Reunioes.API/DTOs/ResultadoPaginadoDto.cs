using System.Collections.Generic;

namespace Reunioes.API.DTOs
{
    public class ResultadoPaginadoDto<T>
    {
        public List<T> Itens { get; set; } = new List<T>();
        public int TotalItens { get; set; }
    }
}