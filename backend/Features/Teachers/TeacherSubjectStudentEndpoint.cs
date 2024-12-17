using backend.DbModels;
using backend.DbModels.Models;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;

namespace backend.Features.Teachers;


public record TSRequest(int Id);

public record TSGradeTypes(int Id, string column, float percentage);

public record TSGrade(float Value, int GradeTypeId);

public record TSStudent(int Id, string Name, ICollection<TSGrade> Grades);

public record TSResponse(ICollection<TSGradeTypes> Columns, ICollection<TSStudent> Students, string subjectName);

public class TeacherSubjectStudentEndpoint : Endpoint<TSRequest, TSResponse>
{
    private readonly AppDbContext db;

    public TeacherSubjectStudentEndpoint(AppDbContext db)
    {
        this.db = db;
    }

    public override void Configure()
    {
        Verbs(Http.GET);
        Routes("/teacher/subject");
        Policies("TeacherOnly");
    }

    public override async Task HandleAsync(TSRequest req, CancellationToken ct)
    {
        var teacher = await db.Teachers.FirstOrDefaultAsync(x=>x.Username == (string)User.Identity.Name, ct);

        var subject = teacher.Subjects.FirstOrDefault(x => x.Id == req.Id);

        var tgradeTypes = new List<TSGradeTypes>();

        subject.GradeTypes.ToList().ForEach(x=> tgradeTypes.Add(new TSGradeTypes(x.Id, x.Name, x.Percentage)));

        var tStudents = new List<TSStudent>();

        subject.Group.Students.ToList().ForEach(x => tStudents.Add(new TSStudent(
            x.Id,
            x.FirstName + " " + x.LastName,
            x.Grades.Select(grade => new TSGrade(grade.Value, grade.GradeTypeId)).ToList()
        )));

        await SendAsync(new TSResponse(tgradeTypes, tStudents, subject.Name), cancellation: ct);
    }
}