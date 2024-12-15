namespace backend.Features.Auth.Interfaces;

public interface IAuthHandler
{
    Task<string> HandleAsync(AuthRequest req, CancellationToken ct);
}