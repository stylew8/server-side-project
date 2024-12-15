using backend.Infrastructure.Security.Interfaces;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace backend.Infrastructure.Security;

public class Encryptor : IEncryptor
{
    public string Encrypt(string password, string salt)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password,
            System.Text.Encoding.ASCII.GetBytes(salt),
            KeyDerivationPrf.HMACSHA512,
            5000,
            64
        ));
    }
}