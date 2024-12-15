using backend.Features.Auth.Interfaces;
using backend.Infrastructure.Security.Interfaces;
using FastEndpoints;

namespace backend.Features.Auth;

public class AuthEndpoint : Endpoint<AuthRequest, AuthResponse>
{
    private readonly IEncryptor enc;
    private readonly IAuthHandler handler;

    public AuthEndpoint(IEncryptor enc, IAuthHandler handler)
    {
        this.enc = enc;
        this.handler = handler;
    }

    public override void Configure()
    {
       Verbs(Http.POST);
       Routes("/auth/login");
       AllowAnonymous();
    }

    public override async Task HandleAsync(AuthRequest req, CancellationToken ct)
    {
        try
        {
            var jwt = await handler.HandleAsync(req, ct);

            await SendAsync(new AuthResponse(jwt));
        }
        catch (UnauthorizedAccessException)
        {
            await SendUnauthorizedAsync(ct);
        }
        catch (ArgumentException e)
        {
            await SendAsync(new AuthResponse("Invalid username or password"), 400); 
        }
        catch (InvalidOperationException e)
        {
            await SendAsync(new AuthResponse("An internal error occurred"), 500); 
        }
        catch (Exception ex)
        {
            await SendAsync(new AuthResponse("An unexpected error occurred"), 500);
        }

    }
}

public record AuthResponse(string JwtToken);
public record AuthRequest(string Username, string Password, string AuthType);