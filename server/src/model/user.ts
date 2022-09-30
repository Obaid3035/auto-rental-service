import mongoose, {Model, Schema, Document} from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import BadRequest, { NotFound } from '../lib/errorCode';
import {IUser} from "../interface";


interface UserModel extends Model<IUser>{
    userExist(user: object): Promise<boolean>,
    authenticate(credentials: object): Promise<IUser>,
}

const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

UserSchema.pre<IUser & Document>("save", async function ( next ): Promise<void> {
    const user = this;
    if (user.password && user.isNew) {
        this.password = await bcrypt.hash(user.password, 10)
        next()
    }
})

UserSchema.statics.userExist = async function( { email }: { email: string } ): Promise<boolean> {
    const user = await User.findOne({ email });
    if (user) {
        throw new NotFound('User already exists');
    }
    return true
}


UserSchema.statics.authenticate = async function (credentials): Promise<IUser> {
    const user: IUser = await User.findOne({
        email: credentials.email,
    });
    if (!user) {
        throw new NotFound('Unable too login. Please registered yourself');
    }
    const isMatch: boolean = await bcrypt.compare(credentials.password, user.password);

    if (!isMatch) {
        throw new BadRequest('Email or Password is incorrect');
    }
    return user;
}


UserSchema.methods.generateToken = async function() {
    const user = this;
    return jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
}



const User = mongoose.model<IUser, UserModel>('user', UserSchema);

export default User;
