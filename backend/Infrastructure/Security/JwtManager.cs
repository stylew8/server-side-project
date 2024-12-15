using backend.Infrastructure.Security.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Infrastructure.Security;

public class JwtManager : IJwtManager
{
    private readonly string _secretKey;

    public JwtManager(IConfiguration configuration)
    {
        _secretKey = configuration["jwt:secret"];
    }

    public string CreateJwt(string username, string role)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim("Role", role),
            new Claim("guid", Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddMinutes(15),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string RefreshJwt(string username,string role)
    {
        return CreateJwt(username, role);
    }

    public ClaimsPrincipal? Verify(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_secretKey);

        try
        {
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false, 
                ValidateAudience = false, 
                ValidateLifetime = true, 
                ValidateIssuerSigningKey = true, 
                IssuerSigningKey = new SymmetricSecurityKey(key) 
            };

            
            var c = tokenHandler.ValidateToken(token, validationParameters, out _);


            return c; 
        }
        catch
        {
            return null; 
        }
    }

    public string GetUsernameFromToken(string token)
    {
        return "";
    }
}