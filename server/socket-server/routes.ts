/** @file Imported to register SocketIO events. */
import { Socket } from "socket.io";
import { getMidiBytes } from "../../music/getMidiBytes";
import { EventType, share } from "../share";
import { Command } from "../Task";
import { io } from "./socket-server";

/** Typed data for eventTrigger event. */
interface EventData
{
    /** Type of event being triggered. */
    eventType: EventType;
}

io.on("connection", (socket: Socket) =>
{
    console.log("ooh someone connected to socket");

    socket.on("eventTrigger", (data: EventData) =>
    {
        socket.send("socket received thing");
        console.log(`eventTrigger type: ${data.eventType}`);

        const command = share[data.eventType];
        if (command)
        {
            execute(command);

            socket.emit("taskFinished");
            share[data.eventType] = undefined;
        }
    });

    /**
     * Executes a Command.
     * @param command Command to execute.
     */
    function execute(command: Command): void
    {
        switch (command.type)
        {
            case "alert":
                socket.emit("clientAlert", command.msg);
                console.log(`alert: ${command.msg}`);
                break;
            case "play":
                getMidiBytes(command.notes)
                    // .then((bytes: string) => socket.emit("playMidi", bytes));
                break;
        }
    }

    socket.on("disconnect", () =>
    {
        console.log("disconnected");
    });
});
