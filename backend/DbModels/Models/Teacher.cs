using System.ComponentModel.DataAnnotations;

namespace backend.DbModels.Models
{
    public class Teacher : Person
    {
        [Required, MaxLength(255)]
        public string FirstName { get; set; }

        [Required, MaxLength(255)]
        public string LastName { get; set; }

        public virtual ICollection<Subject> Subjects { get; set; }
    }
}
