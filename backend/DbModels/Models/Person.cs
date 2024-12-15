using System.ComponentModel.DataAnnotations;

namespace backend.DbModels.Models;

public abstract class Person
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(255)]
    public string Username { get; set; }

    [Required, MaxLength(255)]
    public string HashedPassword { get; set; }

    [Required, MaxLength(255)]
    public string Salt { get; set; }
}