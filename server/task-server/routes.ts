/**
 * @file Imported to register all the HTTP request routes for the task server.
 */
import { Request, Response } from "express";
import { share } from "../share";
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
    /** Type of object to search for in the camera if needed. */
    camera: string | null;
    /** Name of the estimote beacon to search for if needed. */
    estimote: string | null;
}

const taskParser = new TaskParser();

app.post("/task", (req: Request, res: Response) =>
{
    const body = req.body as TaskInput;
    console.log(`task received: ${JSON.stringify(body)}`);

    // parse message
    let task: Task;
    const out: TaskOutput =
    {
        msg: "Invalid message", valid: false, camera: null, estimote: null
    };
    try
    {
        task = taskParser.parse(body.text);
    }
    catch (e)
    {
        console.error(e);
        res.send(JSON.stringify(out));
        return;
    }
    console.log(`parsed task: ${JSON.stringify(task)}`);

    switch (task.when.type)
    {
        case "near":
            out.msg = `Waiting for the ${task.when.beacon.name} beacon to \
approach me`;
            out.valid = true;
            out.estimote = task.when.beacon.name;
            share.estimote = task.then;
            break;
        case "see":
            out.msg = `Searching for a ${task.when.object}`;
            out.valid = true;
            out.camera = task.when.object;
            share.nn = task.then;
            break;
    }

    res.send(JSON.stringify(out));
});
