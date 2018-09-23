/** @file Imported to register SocketIO events. */
import { Socket } from "socket.io";
import { io } from "./socket-server";

io.on("connection", (socket: Socket) =>
{
    console.log("ooh someone connected to socket");

    socket.on("eventTrigger", data =>
    {
        socket.send("socket received thing");
        console.log(`eventTrigger type: ${data.eventType}`);
    });

    socket.on("disconnect", () =>
    {
        console.log("disconnected");
    });
});
