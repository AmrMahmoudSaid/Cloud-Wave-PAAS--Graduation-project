import express from 'express';
import 'express-async-errors'
import cookieSession from "cookie-session";
import {json} from "body-parser";
import mongoose from 'mongoose';
import {currentUser} from "@cloud-wave/common";

import * as tty from "tty";
import {errorHandler, NotFound} from "@cloud-wave/common";
import {showApplicationConfig} from "./routes/show";
import {deleteDatabase} from "./routes/delete";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false
    // secure: true
}))
app.use(currentUser);
app.use(showApplicationConfig);
app.use(deleteDatabase);
app.all('*', () => {
    throw new NotFound();
})
app.use(errorHandler);

export {app};