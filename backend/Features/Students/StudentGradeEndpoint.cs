using backend.DbModels;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Students;


public record StudentGradeRequest(int Id);
public record StudentGradeResponse(int grade_type_id, float? value);

public class StudentGradeEndpoint : Endpoint<StudentGradeRequest, StudentGradeResponse>
{
    private readonly AppDbContext db;

    public StudentGradeEndpoint(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Routes("/student/grade");
        Policies("StudentOnly");
    }

    public override async Task HandleAsync(StudentGradeRequest req, CancellationToken ct)
    {
        var grade = await db.GradeTypes.FirstOrDefaultAsync(x => x.Id == req.Id, ct);

        if (grade == null)
        {
            await SendAsync(new StudentGradeResponse(0, 0), cancellation: ct);

        }
        else
        {
            var username = User?.Identity?.Name;

            if (string.IsNullOrEmpty(username))
            {
                // Handle the case where username is null or empty
                await SendAsync(new StudentGradeResponse(0, 0), cancellation: ct);
                return;
            }

            var studentGrade = grade.Grades.FirstOrDefault(x => x.Student.Username == username);
            var gradeValue = studentGrade?.Value;

            await SendAsync(
                new StudentGradeResponse(
                    grade.Id,
                    gradeValue ),
                cancellation: ct);
        }

    }
}