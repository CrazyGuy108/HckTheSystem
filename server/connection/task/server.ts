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

const app: Application = express();

const jsonParser = bodyParser.json({type: "application/json"});

app.post("/task", jsonParser, (req: Request, res: Response) =>
{
    const body = req.body as TaskInput;
    console.log(`task received: ${JSON.stringify(body)}`);
    res.send(JSON.stringify(body));

    // TODO: nlp stuff :D
});

export const taskServer: Application = app;
