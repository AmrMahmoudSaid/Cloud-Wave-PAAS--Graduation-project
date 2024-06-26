import mongoose from "mongoose";
interface ProductAttrs {
    name: string;
    priceId: string;
}
interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

// interface des that attributes that document model has
interface ProductDoc extends mongoose.Document {
    name: string;
    priceId: string;
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    priceId: {
        type: String,
        required: false
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});


productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
}
const Product = mongoose.model<ProductDoc,ProductModel>('Product', productSchema);

export {Product};