import express from 'express';
import 'express-async-errors'
import cookieSession from "cookie-session";
import {json} from "body-parser";
import mongoose from 'mongoose';
import {currentUser} from "@cloud-wave/common";

import * as tty from "tty";
import {errorHandler, NotFound} from "@cloud-wave/common";
import {showDatabaseConfig} from "./routes/show";
import {deleteDatabase} from "./routes/delete";
import {databaseConfigIndex} from "./routes";
import {databaseBilling} from "./routes/billing";
import {showDatabaseLogs} from "./routes/logs";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false
    // secure: true
}))
app.use(currentUser);
app.use(showDatabaseConfig);
app.use(deleteDatabase);
app.use(databaseConfigIndex);
app.use(databaseBilling);
app.use(showDatabaseLogs)
app.all('*', () => {
    throw new NotFound();
})
app.use(errorHandler);

export {app};