import {Schema, model, Model} from "mongoose";
import {ICustomer} from "../interface";


interface CustomerModel extends Model<ICustomer>{
    customerExist(cnic: string): Promise<boolean>,
    findCustomerAndCount(skip: number, limit: number, search?: string): Promise<{count: object, customers: object[]}>,
}

const CustomerSchema: Schema<ICustomer> = new Schema({
    name: {
        type: String,
        required: true
    },
    cnic: {
        type: String,
        required: true
    },
    passport: {
        type: String,
    },
    residentialAddress: {
        type: String,
        required: true
    },
    officeAddress: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    license: {
        type: String,
    },
    referenceName: {
        type: String,
    },
    referencePhone: {
        type: String,
    },
    referenceAddress: {
        type: String,
    },
    referenceCnic: {
        type: String,
    },
})

CustomerSchema.index({
    name: "text",
    phone: "text",
    cnic: "text",
})

CustomerSchema.statics.customerExist = async function ( cnic: string ){
    const customer = await Customer.findOne({ cnic });
    if (customer) {
        throw new Error('Customer already exist');
    }
    return true;
}

CustomerSchema.statics.findCustomerAndCount = async function (skip:number, limit:number, search?: string) {
    let customersObjectPromise;
    customersObjectPromise = Customer.aggregate([
        {
            $project: {
                name: 1,
                phone: 1,
                cnic: 1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ])
    if (search && search.length > 0) {
        customersObjectPromise = Customer.aggregate([
            {
                $match: {
                    $text: {
                        $search: search
                    },
                }
            },
            {
                $project: {
                    name: 1,
                    phone: 1,
                    cnic: 1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ])
    }

    const countPromise = Customer.count();


    const [customersObject, count] =  await Promise.all([customersObjectPromise, countPromise]);



    const customers = customersObject.map((i:any) => {
        return Object.values(i)
    });


    return {
        count,
        customers
    }
}

const Customer = model<ICustomer, CustomerModel>('customer', CustomerSchema);

export default Customer
