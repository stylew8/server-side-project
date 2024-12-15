using System.ComponentModel.DataAnnotations;

namespace backend.DbModels.Models;

public class StudyProgram
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; }

    public string Description { get; set; }

    public virtual ICollection<Group> Groups { get; set; }
    public virtual ICollection<StudyPlan> StudyPlans { get; set; }
}