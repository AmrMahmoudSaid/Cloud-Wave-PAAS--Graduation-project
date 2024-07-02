import mongoose from "mongoose";
import {OrderStatus, ApplicationPlan, applicationOrderType} from "@cloud-wave/common";
export {OrderStatus, applicationOrderType, ApplicationPlan}

interface OrderAttrs{
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    applicationOrderType: applicationOrderType;
    price: number;
    gitUrl: string;
    applicationName: string;
    plan: ApplicationPlan;
    port: number;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    applicationOrderType: applicationOrderType;
    price: number;
    gitUrl: string;
    applicationName: string;
    plan: ApplicationPlan;
    port: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

// @ts-ignore
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.AwaitingPayment
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    applicationOrderType: {
        type: String,
        required: true,
        enum: Object.values(applicationOrderType),
    },
    price: {
        type: Number,
        required: true,
    },
    port: {
        type: Number,
        required: true,
    },
    gitUrl: {
        type: String,
        required: true,
    },
    applicationName: {
        type: String,
        required: true,
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

orderSchema.statics.build =(attrs: OrderAttrs) =>{
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};