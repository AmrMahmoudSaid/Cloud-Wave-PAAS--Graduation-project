import mongoose from "mongoose";
import {OrderStatus, ApplicationPlan, applicationOrderType} from "@cloud-wave/common";
export {OrderStatus, applicationOrderType, ApplicationPlan}

interface OrderAttrs{
    userId: string;
    imageName: string;
    tag: string;
    gitUrl: string;
    applicationName: string;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    imageName: string;
    tag: string;
    gitUrl: string;
    applicationName: string;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    gitUrl: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    imageName: {
        type: String,
        required: true,
    },
    applicationName: {
        type: String,
        required: true,
    }

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build =(attrs: OrderAttrs) =>{
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};