using System.ComponentModel.DataAnnotations;
using backend.DbModels.Models;
using backend.Features.CreateUser.Interfaces;
using backend.Infrastructure.Security.Interfaces;

namespace backend.Features.CreateUser;

public class CreateUserHandler : ICreateUserHandler
{
    private readonly ICreateUserRepository repo;
    private readonly IEncryptor enc;

    public CreateUserHandler(ICreateUserRepository repo, IEncryptor enc)
    {
        this.repo = repo;
        this.enc = enc;
    }

    public async Task<int> HandleAsync(
        string? firstName,
        string? lastName,
        [Required]string username,
        [Required]string password
        )
    {
        string salt = Guid.NewGuid().ToString();

        var hashedPassword = enc.Encrypt(password, salt);


        return await repo.CreateUserAsync(new Student()
        {
            FirstName = firstName ?? "defaultName",
            LastName = lastName ?? "defaultSurname",
            Username = username,
            Salt = salt,
            HashedPassword = hashedPassword,
            GroupId = 1
        });
    }
}