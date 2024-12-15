using backend.Infrastructure.Security.Interfaces;
using FastEndpoints;

namespace backend.Features.Auth;


public record VerifyRequest();

public class VerifyEndpoint : EndpointWithoutRequest
{
    private readonly IJwtManager jwt;

    public VerifyEndpoint(IJwtManager jwt)
    {
        this.jwt = jwt;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Routes("/auth/verify-token");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        var username = User?.Identity?.Name;



        if (string.IsNullOrEmpty(token))
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        try
        {
            var isValid = jwt.Verify(token);

            if (isValid != null)
            {
                var role = isValid.Claims.FirstOrDefault(x => x.Type == "Role")?.Value;

                if (!string.IsNullOrEmpty(role)) 
                {
                    await SendOkAsync(new { Message = "Token is valid", Role = role }, ct);
                }

            }
            else
            {
                await SendAsync(new { Message = "Token is invalid" }, 401, ct); 
            }
        }
        catch (Exception ex)
        {
            await SendAsync(new { Message = $"Token validation failed: {ex.Message}" }, 500, ct);
        }
    }
}