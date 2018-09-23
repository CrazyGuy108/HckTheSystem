/** @file Socket.io server that communicates with the client. */
import * as http from "http";
import SocketIO from "socket.io";
import { app } from "../task-server/task-server";

const httpServer = new http.Server(app);

export const io = SocketIO(httpServer);

/** Starts the entire server. */
export function start(): void
{
    const port: number = +(process.env.PORT || 3000);
    httpServer.listen(port, () =>
    {
        console.log(`Listening on http://localhost:${port}`);
    });
}
