const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { nanoid } = require("nanoid");

const { PeerServer } = require("peer");
const peerServer = PeerServer({ port: 3001, path: "/" });

const io = new Server(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  const roomId = nanoid();
  res.redirect(`/${roomId}`);
});

app.get("/:room", (req, res) => {
  res.render("room", {
    roomId: req.params.room,
  });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
