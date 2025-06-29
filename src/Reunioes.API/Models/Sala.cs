namespace Reunioes.API.Models
{
    public class Sala
    {
        public virtual int Id { get; protected set; }
        public virtual string? Nome { get; set; }
        public virtual int Andar { get; set; }
        public virtual int QuantidadeAssentos { get; set; }
    }
}