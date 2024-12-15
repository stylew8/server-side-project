using backend.DbModels.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.DbModels
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<StudyProgram> StudyPrograms { get; set; }
        public DbSet<StudyPlan> StudyPlans { get; set; }
        public DbSet<Semester> Semesters { get; set; }
        public DbSet<GradeType> GradeTypes { get; set; }
        public DbSet<Grade> Grades { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
            base.OnConfiguring(optionsBuilder);
        }
    }
}
