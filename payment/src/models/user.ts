import mongoose from "mongoose";
interface UserAttrs {
    id: string;
    name: string;
    email: string;
    customerId: string;
}
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// interface des that attributes that document model has
interface UserDoc extends mongoose.Document {
    name: string;
    email: string;
    customerId: string;
    id: string;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    customerId: {
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


userSchema.statics.build = (attrs: UserAttrs) => {
    return new User({
        _id: attrs.id,
        name: attrs.name,
        email: attrs.email,
        customerId: attrs.customerId
    })
}
const User = mongoose.model<UserDoc,UserModel>('User', userSchema);

export {User};