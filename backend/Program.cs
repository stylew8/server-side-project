using System.Text;
using backend.DbModels;
using backend.DbModels.Models;
using backend.Features.Auth;
using backend.Features.Auth.Interfaces;
using backend.Features.CreateUser.Interfaces;
using backend.Features.CreateUser;
using backend.Infrastructure.Security;
using backend.Infrastructure.Security.Interfaces;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var bld = WebApplication.CreateBuilder();




var secretKey = bld.Configuration.GetValue<string>("jwt:secret");

bld.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey ?? "")),
            RoleClaimType = "Role"
        };
    });

bld.Services.AddAuthorization(options =>
{
    options.AddPolicy("StudentOnly", policy => policy.RequireClaim("Role", "Student"));
    options.AddPolicy("TeacherOnly", policy => policy.RequireClaim("Role", "Teacher"));
    options.AddPolicy("AdminOnly", policy => policy.RequireClaim("Role", "Admin"));
});

//features
bld.Services.AddScoped<ICreateUserHandler, CreateUserHandler>();
bld.Services.AddScoped<ICreateUserRepository, CreateUserRepository>();
bld.Services.AddScoped<IAuthHandler, AuthHandler>();
bld.Services.AddScoped<IAuthRepo<Student>, AuthRepository<Student>>();
bld.Services.AddScoped<IAuthRepo<Teacher>, AuthRepository<Teacher>>();
bld.Services.AddScoped<IAuthRepo<Admin>, AuthRepository<Admin>>();

//infrastructure
bld.Services.AddScoped<IEncryptor, Encryptor>();
bld.Services.AddScoped<IJwtManager, JwtManager>();


bld.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(bld.Configuration.GetConnectionString("DefaultConnection") ?? ""));


bld.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhostOnly", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

bld.Services.AddFastEndpoints();
var app = bld.Build();

app.UseCors("AllowLocalhostOnly");

app.UseAuthentication();
app.UseAuthorization();

app.UseDeveloperExceptionPage();
app.UseFastEndpoints();
app.Run();
