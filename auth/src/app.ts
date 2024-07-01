import express from 'express';
import 'express-async-errors'
import cookieSession from "cookie-session";
import {json} from "body-parser";
import mongoose from 'mongoose';
// import cors from 'cors';
import {currentUserRouter} from "./routes/currentuser";
import {signinRouter} from "./routes/signin";
import {signoutRouter} from "./routes/signout";
import {signupRouter} from "./routes/signup";
import {signupGitRouter} from "./routes/signup-github";
import {loginGitRouter} from "./routes/signin-github";
import {errorHandler,NotFound} from "@amtickets377/common"
import {createCustomer} from "./routes/create-customer";

const app = express();
app.set('trust proxy', true);

// app.use(cors());
app.use(json());
app.use(cookieSession({
    signed: false
    // secure: true
}))
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signupGitRouter);
app.use(createCustomer);
app.use(loginGitRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.all('*', () => {
    throw new NotFound();
})
app.use(errorHandler);

export {app};