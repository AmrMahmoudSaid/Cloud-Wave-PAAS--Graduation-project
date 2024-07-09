import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";
import axios from 'axios';
import dotenv from 'dotenv';
interface UserPayload {
    id: string;
    email: string;
    githubId: string;
    accessToken: string;
    name: string;
}
//to add UserPayload to req
declare global{
    namespace Express {
        interface Request{
            currentUser?: UserPayload;
        }
    }
}
export const currentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {
        return next();
    }

    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    if (payload.accessToken){
        try {
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${req.session.jwt}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
        }catch (error: any) {
            if (error.response && error.response.status === 401) {
                res.status(401).send({ error: 'Invalid GitHub token!!' });
            }
        }
    }
    req.currentUser = payload;

    next();
};