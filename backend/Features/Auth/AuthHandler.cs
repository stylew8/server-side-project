using backend.DbModels.Models;
using backend.Features.Auth.Interfaces;
using backend.Infrastructure.Security.Interfaces;

namespace backend.Features.Auth;

public class AuthHandler : IAuthHandler
{
    private readonly IEncryptor enc;
    private readonly IAuthRepo<Student> repoStudent;
    private readonly IAuthRepo<Admin> repoAdmin;
    private readonly IAuthRepo<Teacher> repoTeacher;
    private readonly IJwtManager jwt;

    public AuthHandler(
        IEncryptor enc,
        IAuthRepo<Student> repoStudent,
        IAuthRepo<Admin> repoAdmin,
        IAuthRepo<Teacher> repoTeacher,
        IJwtManager jwt)
    {
        this.enc = enc;
        this.repoStudent = repoStudent;
        this.repoAdmin = repoAdmin;
        this.repoTeacher = repoTeacher;
        this.jwt = jwt;
    }

    public async Task<string> HandleAsync(AuthRequest req, CancellationToken ct)
    {
        switch (req.AuthType)
        {
            case "student":
                return await Login(repoStudent, req.Username, req.Password, ct);
                break;
            case "teacher":
                return await Login(repoTeacher, req.Username, req.Password, ct);
                break;
            case "admin":
                return await Login(repoAdmin, req.Username, req.Password, ct);
                break;
            default:
                throw new ArgumentException("we dont know this type of auth");

        }
    }

    private async Task<string> Login<T>(IAuthRepo<T> repo, string username, string password, CancellationToken ct)
    {
        var s = await repo.GetSalt(username);

        if (s == null)
        {
            throw new ArgumentException("we cant find your salt");
        }

        var hashedPassword = enc.Encrypt(password, s);

        if (await repo.HandleAuth(username, hashedPassword, ct))
        {
            return jwt.CreateJwt(username, typeof(T).Name);
        }

        throw new UnauthorizedAccessException("Invalid username or password.");
    }
}