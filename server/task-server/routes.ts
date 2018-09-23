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
    /** Message to send. */
    msg: string;
}

const taskParser = new TaskParser();

app.post("/task", (req: Request, res: Response) =>
{
    const body = req.body as TaskInput;
    console.log(`task received: ${JSON.stringify(body)}`);

    const task = taskParser.parse(body.text);
    console.log(`parsed task: ${JSON.stringify(task)}`);

    let msg: string;
    switch (task.when.type)
    {
        case "near":
            msg = `Waiting for beacon ${task.when.subject} to approach \
${task.when.object}`;
            break;
        case "see":
            msg = `Searching for a ${task.when.object}`;
            break;
        default:
            msg = "";
    }

    const out: TaskOutput = {msg};
    res.send(JSON.stringify(out));
});
