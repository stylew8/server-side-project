using backend.DbModels;
using backend.DbModels.Models;
using backend.Infrastructure.Security.Interfaces;
using FastEndpoints;

namespace backend.Features.Admin;

public record TRequest(string Username, string Password, string UserType);
public record TResponse(string Message);

public class AdminUserCreateEndpoint : Endpoint<TRequest, TResponse>
{
    private readonly AppDbContext db;
    private readonly IEncryptor enc;

    public AdminUserCreateEndpoint(AppDbContext db, IEncryptor enc)
    {
        this.db = db;
        this.enc = enc;
    }

    public override void Configure()
    {
        Verbs(Http.POST);
        Routes("/admin/user");
        Policies("AdminOnly");
    }

    public override async Task HandleAsync(TRequest req, CancellationToken ct)
    {
        try
        {
            var salt = Guid.NewGuid().ToString();

            var hashedPassword = enc.Encrypt(req.Password, salt);

            switch (req.UserType)
            {
                case "admin":
                    db.Admins.Add(new DbModels.Models.Admin()
                    {
                        HashedPassword = hashedPassword,
                        Salt = salt,
                        Username = req.Username
                    });
                    break;
                case "student":
                    db.Students.Add(new Student()
                    {
                        FirstName = "default",
                        LastName = "default",
                        GroupId = 1,
                        HashedPassword = hashedPassword,
                        Salt = salt,
                        Username = req.Username
                    });
                    break;
                case "teacher":
                    db.Teachers.Add(new Teacher()
                    {
                        FirstName = "default",
                        LastName = "default",
                        HashedPassword = hashedPassword,
                        Salt = salt,
                        Username = req.Username
                    });
                    break;
                default:
                    await SendAsync(new TResponse("We dont know this type"),405, ct);
                    return;
            }

            await db.SaveChangesAsync(ct);
            await SendAsync(new("All good"),200, ct);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            await SendAsync(new TResponse("ERROR IN adminUSERCREATE"), 501, ct);
            return;
        }
    }
}