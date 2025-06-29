namespace Reunioes.API.Models
{
    public class Reserva
    {
        public virtual int Id { get; protected set; }
        public virtual DateTime Inicio { get; set; }
        public virtual DateTime Fim { get; set; }
        public virtual Sala? Sala { get; set; }
    }
}