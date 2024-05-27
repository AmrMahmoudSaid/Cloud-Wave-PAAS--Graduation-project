import 'express-async-errors'
import mongoose from 'mongoose';
import {app} from "./app";

const start = async () => {
    process.env.JWT_KEY = "amrmahmoud"
    if (!process.env.JWT_KEY){
        throw  new Error('jwt key doesnt exist');
    }
    // if (!process.env.MONGO_URL){
    //     throw  new Error('Mongo url doesnt exist');
    // }
    try{
        // await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        await mongoose.connect('mongodb://localhost:27017/auth2' );
        console.log("DB connection");
    }catch (err){
        console.log(err);
    }
};
app.listen(4000,() =>{
    console.log('Listening on port 4000');
});
start();