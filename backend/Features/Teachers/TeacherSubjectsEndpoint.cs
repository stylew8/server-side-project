using backend.DbModels;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Teachers;

public record SubjectsDto(int Id, string Name);
public record TeacherSubjectsResponse(ICollection<SubjectsDto> Subjects);

public class TeacherSubjectsEndpoint : EndpointWithoutRequest<TeacherSubjectsResponse>
{
    private readonly AppDbContext db;

    public TeacherSubjectsEndpoint(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Routes("/teacher/subjects");
        Policies("TeacherOnly");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var username = User?.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            await SendUnauthorizedAsync(ct);
        }
        else
        {
            var teacher = await db.Teachers.FirstOrDefaultAsync(x => x.Username == username, ct);

            var subjects = new List<SubjectsDto>();

            if (teacher.Subjects != null)
            {
                teacher.Subjects.ToList().ForEach(x=>subjects.Add(new SubjectsDto(x.Id,x.Name)));
            }

            await SendAsync(new TeacherSubjectsResponse(subjects), cancellation: ct);

        }
    }
}