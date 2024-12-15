using backend.DbModels;
using backend.DbModels.Models;
using backend.Features.Auth.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;

namespace backend.Features.Auth;

public class AuthRepository<T> : IAuthRepo<T>
    where T : Person
{
    private readonly AppDbContext db;
    private readonly DbSet<T> Entity;

    public AuthRepository(AppDbContext db)
    {
        this.db = db;
        this.Entity = db.Set<T>();
    }

    public async Task<bool> HandleAuth(string username, string hashed_password, CancellationToken ct)
    {
        var student = await Entity
            .FirstOrDefaultAsync(s => s.Username == username && s.HashedPassword == hashed_password, ct);

        if (student == null)
        {
            return false;
        }

        return true;
    }

    public async Task<string?> GetSalt(string username)
    {
        var person = await Entity.FirstOrDefaultAsync(x => x.Username == username);

        if (person == null)
        {
            return null;
        }

        return person.Salt;
    }
}