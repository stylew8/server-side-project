using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DbModels.Models;

public class Semester
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public int StudyPlanId { get; set; }

    [ForeignKey("StudyPlanId")]
    public virtual StudyPlan StudyPlan { get; set; }

    public virtual ICollection<Subject> Subjects { get; set; }
}