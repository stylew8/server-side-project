using backend.DbModels;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using backend.DbModels.Models;

namespace backend.Features.Teachers
{
    public class UpdateGradeRequest
    {
        public int StudentId { get; set; }
        public int GradeTypeId { get; set; }
        public float NewGrade { get; set; }
    }

    public class TeacherUpdateGradeEndpoint : Endpoint<UpdateGradeRequest>
    {
        private readonly AppDbContext _dbContext;

        public override void Configure()
        {
            Verbs(Http.POST);
            Routes("/teacher/update-grade");
            Policies("TeacherOnly");
        }

        public TeacherUpdateGradeEndpoint(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public override async Task HandleAsync(UpdateGradeRequest request, CancellationToken ct)
        {
            if (request.NewGrade < 0 || request.NewGrade > 10)
            {
                await SendAsync(Results.BadRequest("Grade must be between 0 and 10"));
                return;
            }

            var student = await _dbContext.Students
                .Include(s => s.Grades) 
                .FirstOrDefaultAsync(s => s.Id == request.StudentId);

            if (student == null)
            {
                await SendAsync(Results.NotFound("Student not found"));
                return;
            }

            var grade = student.Grades.FirstOrDefault(g => g.GradeTypeId == request.GradeTypeId);
            if (grade == null)
            {
                await _dbContext.Grades.AddAsync(new Grade()
                {
                    GradeTypeId = request.GradeTypeId,
                    StudentId = request.StudentId,
                    Value = request.NewGrade,
                    FinalGrade = 0
                }, ct);

                await _dbContext.SaveChangesAsync(ct);

                await SendAsync(Results.Ok("Grade created successfully"));
                return;
            }

            grade.Value = request.NewGrade;

            await _dbContext.SaveChangesAsync();

            await SendAsync(Results.Ok("Grade updated successfully"));
        }
    }
}
