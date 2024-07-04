import express from 'express';
import 'express-async-errors'
import cookieSession from "cookie-session";
import {json} from "body-parser";
import mongoose from 'mongoose';
// import cors from 'cors';

import {errorHandler,NotFound} from "@amtickets377/common"
import {webhook} from "./routes/webhook";

const app = express();
app.set('trust proxy', true);

// app.use(cors());
app.use(json());
app.use(cookieSession({
    signed: false
    // secure: true
}))
app.use(webhook);
app.all('*', () => {
    throw new NotFound();
})
app.use(errorHandler);

export {app};