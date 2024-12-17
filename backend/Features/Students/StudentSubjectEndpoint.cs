using backend.DbModels;
using backend.DbModels.Models;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Students;


public record StudentSubjectRequest(int Id);

public record SubjectDto(int Id, string Name);

public record GradeTypeDto(int id, string name, float percentage);
public record StudentSubjectResponse(string teacher_name, SubjectDto Subject, List<GradeTypeDto> grade_types);

public class StudentSubjectEndpoint : Endpoint<StudentSubjectRequest, StudentSubjectResponse>
{
    private readonly AppDbContext db;

    public StudentSubjectEndpoint(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Policies("StudentOnly");
        Routes("/student/subject");
    }

    public override async Task HandleAsync(StudentSubjectRequest req, CancellationToken ct)
    {
        var username = User?.Identity?.Name;

        if (string.IsNullOrEmpty(username))
        {
            await SendUnauthorizedAsync(ct);
        }

        var subject = await db.Subjects.FirstOrDefaultAsync(x => x.Id == req.Id, ct);

        List<GradeTypeDto> gradeTypes = new List<GradeTypeDto>();

        if (subject is { GradeTypes: not null, Teacher: not null })
        {
            subject?.GradeTypes.ToList().ForEach(x=> gradeTypes.Add(new GradeTypeDto(x.Id, x.Name, x.Percentage)));

            var response = new StudentSubjectResponse(
                subject?.Teacher?.FirstName + " " + subject?.Teacher?.LastName,
                new SubjectDto(subject.Id,subject.Name),
                gradeTypes
            );
            Console.WriteLine(response.teacher_name);

            await SendAsync(response, cancellation: ct);
        }

    }
}