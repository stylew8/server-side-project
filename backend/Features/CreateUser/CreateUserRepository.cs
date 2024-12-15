using backend.DbModels;
using backend.DbModels.Models;
using backend.Features.CreateUser.Interfaces;

namespace backend.Features.CreateUser;

public class CreateUserRepository : ICreateUserRepository
{
    private readonly AppDbContext db;

    public CreateUserRepository(AppDbContext db)
    {
        this.db = db;
    }

    public async Task<int> CreateUserAsync(Student student)
    { 
        var result = await db.Students.AddAsync(student);

        await db.SaveChangesAsync();

        return result.Entity.Id;
    }
}