using System.Security.Claims;

namespace backend.Infrastructure.Security.Interfaces;

public interface IJwtManager
{
    string CreateJwt(string username, string role);
    string RefreshJwt(string username, string role);
    ClaimsPrincipal? Verify(string token);
    string GetUsernameFromToken(string token);
}