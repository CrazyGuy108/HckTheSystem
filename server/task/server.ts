/** @file Express server that establishes websocket connections. */

import * as bodyParser from "body-parser";
import express, { Application, Request, Response } from "express";

/** Input JSON given to the server. */
interface TaskInput
{
    /** Text to be processed. */
    text: string;
}

/** Ouptut JSON given to the client. */
interface TaskOutput
{
    socketURL: string;
}

const taskServer: Application = express();

const jsonParser = bodyParser.json({type: "application/json"});
const port: number = +(process.env.PORT || 3000);

taskServer.post("/", jsonParser, (req: Request, res: Response) =>
{
    const body = req.body as TaskInput;
    console.log(JSON.stringify(body));
    res.send("received\n");
});

taskServer.listen(port, () =>
{
    console.log(`Listening at http://localhost:${port}/`);
});
