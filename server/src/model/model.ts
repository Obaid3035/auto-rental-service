import { Schema, model } from "mongoose";
import {IModel} from "../interface";


const ModelSchema: Schema<IModel> = new Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brand',
        required: true
    }
})


ModelSchema.index({
    name: "text"
})



const Model = model<IModel>('model', ModelSchema);

export default Model;
