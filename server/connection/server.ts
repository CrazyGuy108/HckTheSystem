/** @file Socket.io server that communicates with the app. */
import * as http from "http";
import SocketIO, { Socket } from "socket.io";
import { taskServer } from "./task/server";

const httpServer = new http.Server(taskServer);
const io = SocketIO(httpServer);

io.on("connection", (socket: Socket) =>
{
    console.log("ooh someone connected to socket");
    socket.on("disconnect", () =>
    {
        console.log("disconnected");
    });
});

const port: number = +(process.env.PORT || 3000);
httpServer.listen(port, () =>
{
    console.log(`Listening on http://localhost:${port}`);
});
