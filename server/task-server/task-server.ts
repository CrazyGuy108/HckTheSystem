/** @file Express server that parses task messages. */
import * as bodyParser from "body-parser";
import express, { Application } from "express";

/** Express application. */
export const app: Application = express();

const jsonParser = bodyParser.json({type: "application/json"});
app.use(jsonParser);
