using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DbModels.Models;

public class GradeType
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; }

    public string Description { get; set; }

    [Required]
    public float Percentage { get; set; }

    public int SubjectId { get; set; }

    [ForeignKey("SubjectId")]
    public virtual Subject Subject { get; set; }

    public virtual ICollection<Grade> Grades { get; set; }
}