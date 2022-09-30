import { Schema, model } from "mongoose";
import {IBrand} from "../interface";


const BrandSchema: Schema<IBrand> = new Schema({
    name: {
        type: String,
        required: true
    }
})

BrandSchema.index({
    name: "text"
})

const Brand = model<IBrand>('brand', BrandSchema);

export default Brand;
