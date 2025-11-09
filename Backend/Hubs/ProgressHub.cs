using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs;

public class ProgressHub : Hub
{
    public async Task SendProgress(string message, int percentage)
    {
        await Clients.Caller.SendAsync("ReceiveProgress", message, percentage);
    }

    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}

