namespace backend.Features.CreateUser.Interfaces;

public interface ICreateUserHandler
{
    public Task<int> HandleAsync(string firstName, string lastName, string username, string password);
}