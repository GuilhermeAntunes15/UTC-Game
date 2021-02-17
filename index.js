const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
require("universal-fetch");

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  console.log("Conectou");

  socket.emit("A");

  socket.on("join-room", (roomId, userId) => {
    console.log("Se juntou ao ", roomId);
    socket.room = roomId;
    socket.join(roomId);

    if (io.sockets.adapter.rooms.get(roomId).size === 1) socket.emit("player1");

    socket.broadcast.emit("user-connected", userId);

    socket.on("game-start", async () => {
      const joke = await fetch(
        "https://api-de-charadas.fredes.now.sh/"
      ).then((r) => r.json());

      io.sockets.in(socket.room).emit("joke", joke);
    });

    socket.on("loser", (loser) => {
      io.sockets.in(socket.room).emit("new-loser", loser);
    });

    socket.on("new-joke", async () => {
      const joke = await fetch(
        "https://api-de-charadas.fredes.now.sh/"
      ).then((r) => r.json());

      io.sockets.in(socket.room).emit("joke", joke);
    });

    socket.on("disconnect", () => {
      io.to(socket.room).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(3001, () => {
  console.log("SERVER ON 3001");
});
