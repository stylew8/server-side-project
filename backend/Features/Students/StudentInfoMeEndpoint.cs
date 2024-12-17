using backend.DbModels;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Students;

public record StudentInfoMeResponse(int student_id, string full_name,string program_name,string group_name);
public class StudentInfoMeEndpoint : EndpointWithoutRequest<StudentInfoMeResponse>
{
    private readonly AppDbContext db;

    public StudentInfoMeEndpoint(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Routes("/student/me");
        Policies("StudentOnly");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var student = await db.Students
            .FirstOrDefaultAsync(x => User.Identity != null && x.Username == User.Identity.Name, ct);

        if (student == null)
        {
            await SendUnauthorizedAsync(ct);
        }

        var response = new StudentInfoMeResponse(
            student.Id,
            student.FirstName + " " + student.LastName,
            student.Group.StudyProgram.Name,
            student.Group.Name
            );

        await SendAsync(response, cancellation:ct);
    }
}