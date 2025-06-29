using NHibernate.Mapping.ByCode;
using NHibernate.Mapping.ByCode.Conformist;
using Reunioes.API.Models;

namespace Reunioes.API.Data.Mappings
{
    public class SalaMap : ClassMapping<Sala>
    {
        public SalaMap()
        {
            Table("salas");

            Id(x => x.Id, map => map.Generator(Generators.Sequence, p => p.Params(new { sequence = "salas_id_seq" })));

            Property(x => x.Nome, map => map.NotNullable(true));
            Property(x => x.Andar, map => map.NotNullable(true));
            Property(x => x.QuantidadeAssentos, map => {
                map.Column("quantidadeassentos");
                map.NotNullable(true);
            });
        }
    }
}