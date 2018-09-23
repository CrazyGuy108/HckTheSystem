/** @file Imported to register SocketIO events. */
import { Socket } from "socket.io";
import { io } from "./socket-server";

io.on("connection", (socket: Socket) =>
{
    console.log("ooh someone connected to socket");

    socket.on("clientContext", data =>
    {
        socket.send("socket received thing");
        console.log(`clientContext: ${data}`);
    });

    socket.on("disconnect", () =>
    {
        console.log("disconnected");
    });
});
