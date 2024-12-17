using backend.DbModels;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Admin;

public record TUsers(string Username, string UserType);
public class AdminUsersEndpoint : EndpointWithoutRequest<ICollection<TUsers>>
{
    private readonly AppDbContext db;

    public AdminUsersEndpoint(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Policies("AdminOnly");
        Routes("/admin/users");
    }

    public override async Task HandleAsync(CancellationToken ct)
    { 
        var users = new List<TUsers>();

       var teachers = await db.Teachers.ToListAsync(ct);
       var students = await db.Students.ToListAsync(ct);
       var admins = await db.Admins.ToListAsync(ct);

       teachers.ForEach(x=>users.Add(new TUsers(x.Username, "Teacher")));
       students.ForEach(x=>users.Add(new TUsers(x.Username, "Student")));
       admins.ForEach(x=>users.Add(new TUsers(x.Username, "Admin")));

       await SendAsync(users,200, ct);
    }

}