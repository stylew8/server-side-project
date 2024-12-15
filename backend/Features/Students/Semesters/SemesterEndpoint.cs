using backend.DbModels;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Students.Semesters;

public record SemesterDto(int Id, string Name, string Start, string End);
public record SemesterEndpointResponse(ICollection<SemesterDto> Semesters);

public class SemesterEndpoint : EndpointWithoutRequest<SemesterEndpointResponse>
{
    private readonly AppDbContext db;

    public SemesterEndpoint(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Routes("/students/semesters");
        Policies("StudentOnly");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var username = User?.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            await SendUnauthorizedAsync(ct);
            return;
        }

        var user = await db.Students.FirstOrDefaultAsync(x => x.Username == username, ct);

        var studyplanId = user?.Group?.StudyProgram?.StudyPlans?.FirstOrDefault()?.Id; 

        var semester = await db.Semesters.Where(x => x.StudyPlan.Id == studyplanId).ToListAsync(ct);

        var semesters = new List<SemesterDto>();

        semester.ForEach(x=>
            semesters.Add(
                new SemesterDto(
                    x.Id,
                    x.Name,
                    x.StartDate.ToString("yyyy-MM-dd"),
                    x.EndDate.ToString("yyyy-MM-dd")))
            );

        await SendAsync(new SemesterEndpointResponse(semesters), cancellation: ct);
    }
}