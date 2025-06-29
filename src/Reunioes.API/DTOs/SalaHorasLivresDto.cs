namespace Reunioes.API.DTOs
{
    public class SalaHorasLivresDto
    {
        public int SalaId { get; set; }
        public string NomeSala { get; set; } = string.Empty;
        public double HorasLivresHoje { get; set; }
    }
}