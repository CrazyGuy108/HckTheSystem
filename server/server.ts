import express from "express";
import { controller } from "./controllers/controller";

const app: express.Application = express();

const port: number = +(process.env.PORT || 3000);

app.use("/default", controller);
app.listen(port, () =>
{
    console.log(`Listening at http://localhost:${port}/`);
});
