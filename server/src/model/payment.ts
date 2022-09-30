import { Schema, model } from "mongoose";
import { IPayment } from "../interface";


const PaymentSchema: Schema<IPayment> = new Schema({
    rental: {
        type: Schema.Types.ObjectId,
        ref: 'rental',
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
    },

    receiverName: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'carInventory',
        required: true
    },
    paid: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    balance: {
        type: Number,
        required: true
    }
})


const Payment = model<IPayment>('payment', PaymentSchema);

export default Payment;
