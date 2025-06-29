using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NHibernate;
using NHibernate.Cfg;
using NHibernate.Cfg.MappingSchema;
using NHibernate.Dialect;
using NHibernate.Driver;
using NHibernate.Mapping.ByCode;
using Reunioes.API.Data.Mappings;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var nhibernateConfig = new Configuration();
nhibernateConfig.DataBaseIntegration(db =>
{
    db.Dialect<PostgreSQLDialect>();
    db.Driver<NpgsqlDriver>();
    db.ConnectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    db.LogFormattedSql = true;
    db.LogSqlInConsole = true;
});
var mapper = new ModelMapper();
mapper.AddMapping<SalaMap>();
mapper.AddMapping<ReservaMap>();
HbmMapping compiledMappings = mapper.CompileMappingForAllExplicitlyAddedEntities();
nhibernateConfig.AddMapping(compiledMappings);
var sessionFactory = nhibernateConfig.BuildSessionFactory();
builder.Services.AddSingleton(sessionFactory);
builder.Services.AddScoped(factory => sessionFactory.OpenSession());

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();
app.Run();