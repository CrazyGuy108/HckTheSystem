import express from "express";
import { taskController } from "./controllers/task/controller";

const app: express.Application = express();

const port: number = +(process.env.PORT || 3000);

app.use("/task", taskController);
app.listen(port, () =>
{
    console.log(`Listening at http://localhost:${port}/`);
});
