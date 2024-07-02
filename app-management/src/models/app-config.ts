import mongoose from "mongoose";
import {ApplicationPlan} from "@cloud-wave/common";


interface ApplicationConfigAttrs{
    userId: string;
    namespace: string;
    deploymentName: string;
    applicationName: string;
    serviceName: string;
    nodePort: string;
    status : string;
    host: string;
    plan: string;
    lastDeployment: string;
}

interface ApplicationConfigDoc extends mongoose.Document {
    userId: string;
    namespace: string;
    deploymentName: string;
    applicationName: string;
    serviceName: string;
    nodePort: string;
    status : string;
    host: string;
    plan: string;
    lastDeployment: string;
}

interface OrderModel extends mongoose.Model<ApplicationConfigDoc> {
    build(attrs: ApplicationConfigAttrs): ApplicationConfigDoc;
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
    applicationName: {
        type: String,
        required: true
    },
    deploymentName: {
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
    plan : {
        type: String,
        required: true,
        enum: Object.values(ApplicationPlan),
        default: ApplicationPlan.Basic
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

dataConfigSchema.statics.build =(attrs: ApplicationConfigAttrs) =>{
    return new AppConfig(attrs);
}

const AppConfig = mongoose.model<ApplicationConfigDoc, OrderModel>('Order', dataConfigSchema);

export {AppConfig};