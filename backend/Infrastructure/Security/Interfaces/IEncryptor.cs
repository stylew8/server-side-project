namespace backend.Infrastructure.Security.Interfaces;

public interface IEncryptor
{
    string Encrypt(string password, string salt);
}