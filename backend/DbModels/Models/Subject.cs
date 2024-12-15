using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DbModels.Models;

public class Subject
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; }

    public string Description { get; set; }

    public int GroupId { get; set; }
    public int SemesterId { get; set; }
    public int? TeacherId { get; set; }

    [ForeignKey("GroupId")]
    public virtual Group Group { get; set; }

    [ForeignKey("SemesterId")]
    public virtual Semester Semester { get; set; }

    [ForeignKey("TeacherId")]
    public virtual Teacher Teacher { get; set; }

    public virtual ICollection<GradeType> GradeTypes { get; set; }
}