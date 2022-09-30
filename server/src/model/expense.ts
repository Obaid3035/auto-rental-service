import { Schema, model } from "mongoose";
import {IExpense} from "../interface";


const ExpenseSchema: Schema<IExpense> = new Schema({
    expenseType: {
        type: String,
        required: true,
        enum : ['CAR_EXPENSE','GENERAL_EXPENSE'],
    },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'carInventory',
    },
    allExpense: [
        {
            description: String,
            amount: Number
        }
    ],
    totalExpense: Number,
}, {
    timestamps: true
})

const Expense = model<IExpense>('expense', ExpenseSchema);

export default Expense;
