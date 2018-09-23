/**
 * @file Imported to register all the HTTP request routes for the task server.
 */
import { Request, Response } from "express";
import { Task } from "../Task";
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
    /** Message to send. */
    msg: string;
    /** Whether the message is valid. */
    valid: boolean;
}

const taskParser = new TaskParser();

app.post("/task", (req: Request, res: Response) =>
{
    const body = req.body as TaskInput;
    console.log(`task received: ${JSON.stringify(body)}`);

    let task: Task;
    try
    {
        task = taskParser.parse(body.text);
    }
    catch (e)
    {
        console.error(e);
        res.send(`{"msg":"Invalid message","valid":false}`);
        return;
    }
    console.log(`parsed task: ${JSON.stringify(task)}`);

    let msg: string;
    let valid = true;
    switch (task.when.type)
    {
        case "near":
            msg = `Waiting for beacon ${task.when.beacon} to approach me`;
            break;
        case "see":
            msg = `Searching for a ${task.when.object}`;
            break;
        default:
            msg = "";
            valid = false;
    }

    const out: TaskOutput = {msg, valid};
    res.send(JSON.stringify(out));
});
