using backend.DbModels.Models;

namespace backend.Features.CreateUser.Interfaces;

public interface ICreateUserRepository
{
    public Task<int> CreateUserAsync(Student student);
}