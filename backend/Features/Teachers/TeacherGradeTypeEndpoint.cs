using backend.DbModels;
using backend.DbModels.Models;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Teachers;


public record TRequest(string Name, int Percentage,int SubjectId);

public record TResponse(string Message);
public class TeacherGradeTypeEndpoint : Endpoint<TRequest, TResponse>
{
    private readonly AppDbContext db;

    public TeacherGradeTypeEndpoint(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.POST);
        Routes("/teacher/gradeType");
        Policies("TeacherOnly");
    }

    public override async Task HandleAsync(TRequest req, CancellationToken ct)
    {
        var username = User?.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            await SendAsync(new TResponse("Creditials error"),401,cancellation: ct);
            return;
        }

        var teacher =
            await db.Teachers.FirstOrDefaultAsync(x =>
                x.Username == username && x.Subjects.Any(a => a.Id == req.SubjectId),ct);

        if (teacher == null)
        {
            await SendAsync(new TResponse("Teacher doesnt have this subject"), 402, cancellation: ct);
            return;
        }

        await db.GradeTypes.AddAsync(new GradeType()
        {
            SubjectId = req.SubjectId,
            Percentage = req.Percentage,
            Name = req.Name,
            Description = "desc"
        }, ct);

        await db.SaveChangesAsync(ct);

        await SendAsync(new TResponse("GradeType successfully created"), cancellation: ct);
    }
}