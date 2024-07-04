import mongoose from "mongoose";
import {DatabasePlans} from "@cloud-wave/common";


interface DatabaseConfigAttrs{
    userId: string;
    namespace: string;
    pvcName: string;
    deploymentName: string;
    rootPassword: string;
    databaseName: string;
    databaseUsername: string;
    databaseUsernamePass: string;
    serviceName: string;
    nodePort: string;
    status : string;
    host: string;
    lastDeployment: string;
    price: number
}

interface DatabaseConfigDoc extends mongoose.Document {
    userId: string;
    namespace: string;
    pvcName: string;
    deploymentName: string;
    rootPassword: string;
    databaseName: string;
    databaseUsername: string;
    databaseUsernamePass: string;
    serviceName: string;
    nodePort: string;
    status : string;
    host: string;
    lastDeployment: string;
    price: number
}

interface OrderModel extends mongoose.Model<DatabaseConfigDoc> {
    build(attrs: DatabaseConfigAttrs): DatabaseConfigDoc;
}



const dataConfigSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    databaseUsername: {
        type: String,
        required: true
    },
    databaseUsernamePass: {
        type: String,
        required: true
    },
    deploymentName: {
        type: String,
        required: true
    },
    pvcName: {
        type: String,
        required: true
    },
    rootPassword: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    nodePort: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    lastDeployment: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    plan : {
        type: String,
        required: true,
        enum: Object.values(DatabasePlans),
        default: DatabasePlans.Basic
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

dataConfigSchema.statics.build =(attrs: DatabaseConfigAttrs) =>{
    return new DatabaseConfig(attrs);
}

const DatabaseConfig = mongoose.model<DatabaseConfigDoc, OrderModel>('Order', dataConfigSchema);

export {DatabaseConfig};