using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Repositories;
using Services;
using EventDressRental;
using Microsoft.Extensions.Configuration;
using NLog.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseNLog();

// Add services to the container.
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IUserPasswordRipository, UserPasswordRipository>();
builder.Services.AddScoped<IUserPasswordService, UserPasswordService>();

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddScoped<IModelRepository, ModelRepository>();
builder.Services.AddScoped<IModelService, ModelService>();

builder.Services.AddScoped<IDressRepository, DressRepository>();
builder.Services.AddScoped<IDressService, DressService>();

builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddDbContext<EventDressRentalContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("Home")));

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers();

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200") // הכתובת של אנגולר
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "My API V1");
    });
}




app.UseCors("AllowAngularApp");
// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();