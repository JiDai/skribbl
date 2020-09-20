import http from 'http';
import express from 'express';
import cors from "cors";
import { Server } from 'colyseus';
import { monitor } from "@colyseus/monitor";

import { SkribblRoom } from "./room"

const app = express();
const port = Number(process.env.PORT || 3553);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/../public"));
app.use("/colyseus", monitor());

const server = http.createServer(app);
const gameServer = new Server({
    server: server,
    express: app
});

gameServer.define('skribbl', SkribblRoom)
    .on("create", (room) => console.log("room created:", room.roomId))
    .on("dispose", (room) => console.log("room disposed:", room.roomId))
    .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
    .on("leave", (room, client) => console.log(client.id, "left", room.roomId));


gameServer.listen(port);

console.log(`Listening on ws://localhost:${ port }`);
