import mongoose, {Schema} from 'mongoose';

interface OrderAttrs {
    id: string;
    userId: string;
    subscriptionId: string;
    price: number;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    subscriptionId: string;
    price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    subscriptionId: {
        type: String,
        required: true,
    }

},{
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version')
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        price: attrs.price,
        subscriptionId: attrs.subscriptionId
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export {Order};