import {Router} from "express";
import { SchemaDefinitionProperty } from "mongoose";
import {Moment} from "moment";

export interface IController {
    path: string,
    router: Router
}

export interface IUser {
    _id?: string,
    name: string,
    email: string,
    password: string,
    generateToken(): string
}


export interface ICustomer {
    _id?: string,
    name: string,
    cnic: string
    passport: string
    residentialAddress: string
    officeAddress: string
    phone: string
    license: string
    referenceName: string
    referencePhone: string
    referenceAddress: string
    referenceCnic: string
}

export interface IBrand {
    _id?: string,
    name: string,
}



export interface IModel{
    _id?: string,
    name: string,
    brand: SchemaDefinitionProperty<string>
}



export interface IYear{
    _id?: string,
    name: string,
    model: SchemaDefinitionProperty<string>
}

export interface ICarInventory {
    _id?: string,
    regNo: string
    brand: SchemaDefinitionProperty<string> | IBrand
    model: SchemaDefinitionProperty<string>
    year: SchemaDefinitionProperty<string>,
    brandName: string,
    modelName: string,
    yearName: string,
    color: string
    horsePower: string
    transmission: string
    tariff: number,
    documents: [{
        avatar: string,
        cloudinary_id: string
    },],
    status: string
}

export interface IRental{
    _id?: string,
    customer: SchemaDefinitionProperty<string>,
    vehicle: SchemaDefinitionProperty<string>,
    customerName: string,
    vehicleNo: string,
    issueDate: Date,
    returnDate: Date,
    rentalCharge: string,
    SON: string,
    book: string,
    deadline: Date | Moment,
    advanceAmount: number,
    balance: number,
    tariff: number,
    rentalType: string,
    paymentType: string,
    status: string
}

export interface IPayment {
    _id?: string,
    rental: SchemaDefinitionProperty<string>,
    customer: SchemaDefinitionProperty<string>,
    vehicle: SchemaDefinitionProperty<string>,
    issueDate: Date,
    receiverName: string,
    paid: number,
    balance: number,
    discount: number
}


export interface ITree {
    id: string,
    name: string,
    children?: ITree[]
}

export interface IExpense{
    _id?: string,
    expenseType: string,
    vehicle: SchemaDefinitionProperty<string>,
    allExpense: [
        {
            description: string,
            amount: string
        }
    ],
    totalExpense: number
}



