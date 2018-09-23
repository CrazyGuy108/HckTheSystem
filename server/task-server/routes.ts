/**
 * @file Imported to register all the HTTP request routes for the task server.
 */
import { Request, Response } from "express";
import { app } from "./task-server";
import { TaskParser } from "./TaskParser";

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

const taskParser = new TaskParser();

app.post("/task", (req: Request, res: Response) =>
{
    const body = req.body as TaskInput;
    console.log(`task received: ${JSON.stringify(body)}`);
    res.send(JSON.stringify(body));

    const listeners = taskParser.parse(body.text);
    for (const listener in listeners)
    {
        // do stuff with listeners
    }
});
