using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;
using Reunioes.API.Models;

namespace Reunioes.API.Data.Mappings
{
    public class ReservaMap : ClassMapping<Reserva>
    {
        public ReservaMap()
        {
            Table("reservas");

            Id(x => x.Id, map => map.Generator(Generators.Sequence, p => p.Params(new { sequence = "reservas_id_seq" })));

            Property(x => x.Inicio, map => map.NotNullable(true));
            Property(x => x.Fim, map => map.NotNullable(true));

            ManyToOne(x => x.Sala, map =>
            {
                map.Column("salaid");
                map.NotNullable(true);
            });
        }
    }
}