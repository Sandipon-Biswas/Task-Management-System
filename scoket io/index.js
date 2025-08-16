import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname });
});
var users=0;

io.on("connection", (socket) => {
    console.log("A user connected");
    users++;
    socket.emit('newuser',{message:   ' hi hew user' })
    socket.broadcast.emit('newuser',{message: users + ' users connected' })

    
    socket.on('a',(data)=>{
        console.log(data)
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
        users--;
        socket.broadcast.emit('newuser',{message: users + ' users connected' })
    });
});

server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
