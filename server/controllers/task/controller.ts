import * as bodyParser from "body-parser";
import { Request, Response, Router } from "express";
import { TaskBody } from "./TaskBody";

const router = Router();

const jsonParser = bodyParser.json({type: "application/json"});

router.use(jsonParser)
.post("/", (req: Request, res: Response) =>
{
    const body = req.body as TaskBody;
    console.log(JSON.stringify(body));
    res.send("received\n");
});

export const taskController: Router = router;
