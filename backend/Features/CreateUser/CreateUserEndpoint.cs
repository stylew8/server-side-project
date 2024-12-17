using backend.Features.CreateUser.Interfaces;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;

namespace backend.Features.CreateUser
{
    // [Authorize(Policy = "AdminOnly")]
    public class CreateUserEndpoint : Endpoint<CreateUserRequest, CreateUserResponse>
    {
        private readonly ICreateUserHandler _handler;

        public CreateUserEndpoint(ICreateUserHandler handler)
        {
            _handler = handler;
        }

        public override void Configure()
        {
            Verbs(Http.GET);
            Routes("/admin/create");
            AllowAnonymous();
        }

        public override async Task HandleAsync(CreateUserRequest req, CancellationToken ct)
        {
            var userId = await _handler.HandleAsync(req.FirstName, req.LastName, req.Username, req.Password);

            await SendAsync(new CreateUserResponse(userId, "User created successfully!"));
        }
    }

    public record CreateUserRequest(string FirstName, string LastName,string Username, string Password);
    public record CreateUserResponse(int Id, string Message);
}
