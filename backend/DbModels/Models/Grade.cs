using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DbModels.Models;

public class Grade
{
    [Key]
    public int Id { get; set; }

    [Required]
    public float Value { get; set; }

    public float? FinalGrade { get; set; }

    public int GradeTypeId { get; set; }
    public int StudentId { get; set; }

    [ForeignKey("GradeTypeId")]
    public virtual GradeType GradeType { get; set; }

    [ForeignKey("StudentId")]
    public virtual Student Student { get; set; }
}