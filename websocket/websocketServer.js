const WebSocket = require("ws");
const PORT = process.env.PORT || 3002;
const wss = new WebSocket.Server({ port: PORT });

const clients = new Set();

wss.on("connection", function connection(ws) {
  clients.add(ws);

  ws.on("message", function message(data) {
    broadcastMessage(data); // Transmita a mensagem recebida para todos os clientes conectados
  });

  ws.on("close", function () {
    clients.delete(ws);
  });
});

function broadcastMessage(message) {
  clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

