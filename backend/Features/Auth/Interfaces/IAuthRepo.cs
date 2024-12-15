using backend.DbModels.Models;

namespace backend.Features.Auth.Interfaces;

public interface IAuthRepo<T>
{
    Task<bool> HandleAuth(string username, string hashed_password, CancellationToken ct);
    Task<string?> GetSalt(string username);
}