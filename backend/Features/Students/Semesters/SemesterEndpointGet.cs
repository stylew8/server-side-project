using backend.DbModels;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Students.Semesters;

public record SemesterGetRequest(string Id);

public record SubjectDto(int Id, string Name);
public record SemesterGetResponse(string semester_name, ICollection<SubjectDto> subjects);

public class SemesterEndpointGet : Endpoint<SemesterGetRequest, SemesterGetResponse>
{
    private readonly AppDbContext db;

    public SemesterEndpointGet(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Routes("/student/semester");
        Policies("StudentOnly");
    }

    public override async Task HandleAsync(SemesterGetRequest req, CancellationToken ct)
    {
        if (int.TryParse(req.Id, out int id))
        {
            var subjects = await db.Subjects.Where(x => x.SemesterId == id).ToListAsync(ct);

            var semesterName = await db.Semesters.FirstOrDefaultAsync(x => x.Id == id, ct);

            var response = new SemesterGetResponse(semesterName.Name, new List<SubjectDto>());

            subjects.ForEach(x=>response.subjects.Add(new SubjectDto(x.Id,x.Name)));

            await SendAsync(response, cancellation:ct);
            
        }


    }
}