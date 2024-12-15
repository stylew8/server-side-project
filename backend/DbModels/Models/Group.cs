using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DbModels.Models;

public class Group
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; }

    public int StudyProgramId { get; set; }

    [ForeignKey("StudyProgramId")]
    public virtual StudyProgram StudyProgram { get; set; }

    public virtual ICollection<Student> Students { get; set; }

    public virtual ICollection<Subject> Subjects { get; set; }
}