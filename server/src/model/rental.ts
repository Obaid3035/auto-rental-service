import mongoose, {Schema, model, Model} from "mongoose";
import {IRental} from "../interface";
import { formatIssueDateAndReturnDate } from '../lib/helper';


export const fetchRentalQuery = [
    {
        $lookup: {
            from: 'customers',
            localField: 'customer',
            foreignField: '_id',
            as: 'customer'
        }
    },
    {
        $unwind: "$customer"
    },
    {
        $lookup: {
            from: 'carinventories',
            localField: 'vehicle',
            foreignField: '_id',
            as: 'vehicle'
        }
    },
    {
        $unwind: "$vehicle"
    },
]


interface RentalModel extends Model<IRental>{
    findActiveDailyRentalAndCount(skip: number, limit: number, search?: string): Promise<{count: object, rentals: object[]}>,
    findActiveMonthlyRentalAndCount(skip: number, limit: number, search?: string): Promise<{count: object, rentals: object[]}>,
    findInActiveDailyRentalAndCount(skip: number, limit: number, search?: string): Promise<{count: object, rentals: object[]}>,
    findInActiveMonthlyRentalAndCount(skip: number, limit: number, search?: string): Promise<{count: object, rentals: object[]}>,
    findActiveRentalByCustomerAndCount(skip: number, limit: number, customerId: string): Promise<{count: object, rentals: object[]}>
    findInActiveRentalByCustomerAndCount(skip: number, limit: number, customerId: string): Promise<{count: object, rentals: object[]}>
}

const RentalSchema: Schema<IRental> = new Schema({
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
    customerName: {
        type: String,
        required: true
    },
    vehicleNo: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true,
    },
    issueDate: {
        type: Date,
        required: true,
    },
    rentalCharge: {
        type: String,
        required: true,
        enum : ['MONTHLY','DAILY'],
    },
    returnDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    SON: {
        type: String,
        required: true
    },
    book: {
        type: String,
        required: true
    },
    advanceAmount: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    tariff: {
        type: Number,
        required: true
    },

    rentalType: {
        type: String,
        enum : ['WITH_DRIVER','WITHOUT_DRIVER'],
    },
    paymentType: {
        type: String,
        enum : ['CASH', 'CHEQUE', 'CREDIT_CARD', 'ONLINE_TRANSFER'],
    },
    status: {
        type: String,
        enum : ['ACTIVE','INACTIVE'],
        default: 'ACTIVE'
    }
}, {
    timestamps: true
})

RentalSchema.index({
    customerName: "text",
    vehicleNo: "text",
})

RentalSchema.statics.findActiveDailyRentalAndCount = async function ( skip:number, limit:number, search?: string ) {
    let rentalObjectPromise = Rental.aggregate([
        {
            $match: {
                status: "ACTIVE",
                rentalCharge: "DAILY"
            }
        },
        ...fetchRentalQuery,
        {
            $project: {
                regNo: "$vehicle.regNo",
                customer: "$customer.name",
                issueDate: 1,
                balance: 1,
                deadline: 1,
                advanceAmount: 1,
                tariff: 1,
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);
    if (search && search.length > 0) {
        rentalObjectPromise =  Rental.aggregate([
            {
                $match: {
                    status: 'ACTIVE',
                    rentalCharge: "DAILY",
                    $text: {
                        $search: search
                    },
                }
            },
            ...fetchRentalQuery,
            {
                $project: {
                    regNo: "$vehicle.regNo",
                    customer: "$customer.name",
                    issueDate: 1,
                    balance: 1,
                    deadline: 1,
                    advanceAmount: 1,
                    tariff: 1,
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
    }

    const rentalCountPromise = Rental.find({
        status: 'ACTIVE',
        rentalCharge: "DAILY"
    }).count();

    let [rentalObject, count] =  await Promise.all([rentalObjectPromise, rentalCountPromise])

    const rentals = formatIssueDateAndReturnDate(rentalObject)

    return {
        rentals,
        count
    }

}

RentalSchema.statics.findActiveMonthlyRentalAndCount = async function ( skip:number, limit:number, search?: string ) {
    let rentalObjectPromise = Rental.aggregate([
        {
            $match: {
                status: "ACTIVE",
                rentalCharge: "MONTHLY"
            }
        },
        ...fetchRentalQuery,
        {
            $project: {
                regNo: "$vehicle.regNo",
                customer: "$customer.name",
                issueDate: 1,
                balance: 1,
                deadline: 1,
                advanceAmount: 1,
                tariff: 1,
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);
    if (search && search.length > 0) {
        rentalObjectPromise =  Rental.aggregate([
            {
                $match: {
                    status: 'ACTIVE',
                    rentalCharge: "MONTHLY",
                    $text: {
                        $search: search
                    },
                }
            },
            ...fetchRentalQuery,
            {
                $project: {
                    regNo: "$vehicle.regNo",
                    customer: "$customer.name",
                    issueDate: 1,
                    balance: 1,
                    advanceAmount: 1,
                    tariff: 1,
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
    }

    const rentalCountPromise = Rental.find({
        status: 'ACTIVE',
        rentalCharge: "MONTHLY"
    }).count();

    let [rentalObject, count] =  await Promise.all([rentalObjectPromise, rentalCountPromise])

    const rentals = formatIssueDateAndReturnDate(rentalObject)

    return {
        rentals,
        count
    }

}


RentalSchema.statics.findInActiveDailyRentalAndCount = async function ( skip:number, limit:number, search?: string ) {
    let rentalObjectPromise = Rental.aggregate([
        {
            $match: {
                status: 'INACTIVE',
                rentalType: "DAILY"
            }
        },
        ...fetchRentalQuery,
        {
            $project: {
                regNo: "$vehicle.regNo",
                customer: "$customer.name",
                issueDate: 1,
                advanceAmount: 1,
                balance: 1,
                tariff: 1,
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);

    if (search && search.length > 0) {
        rentalObjectPromise =  Rental.aggregate([
            {
                $match: {
                    status: 'INACTIVE',
                    rentalType: "DAILY",
                    $text: {
                        $search: search
                    },
                }
            },
            ...fetchRentalQuery,
            {
                $project: {
                    regNo: "$vehicle.regNo",
                    customer: "$customer.name",
                    issueDate: 1,
                    balance: 1,
                    advanceAmount: 1,
                    tariff: 1,
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
    }

    const rentalCountPromise = Rental.find({
        status: 'INACTIVE',
        rentalType: "DAILY"
    }).count();

    let [rentalObject, count] =  await Promise.all([rentalObjectPromise, rentalCountPromise])

    const rentals = formatIssueDateAndReturnDate(rentalObject)

    return {
        rentals,
        count
    }

}

RentalSchema.statics.findInActiveMonthlyRentalAndCount = async function ( skip:number, limit:number, search?: string ) {
    let rentalObjectPromise = Rental.aggregate([
        {
            $match: {
                status: 'INACTIVE',
                rentalType: "MONTHLY"
            }
        },
        ...fetchRentalQuery,
        {
            $project: {
                regNo: "$vehicle.regNo",
                customer: "$customer.name",
                issueDate: 1,
                advanceAmount: 1,
                balance: 1,
                tariff: 1,
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ]);

    if (search && search.length > 0) {
        rentalObjectPromise =  Rental.aggregate([
            {
                $match: {
                    status: 'INACTIVE',
                    rentalType: "MONTHLY",
                    $text: {
                        $search: search
                    },
                }
            },
            ...fetchRentalQuery,
            {
                $project: {
                    regNo: "$vehicle.regNo",
                    customer: "$customer.name",
                    issueDate: 1,
                    balance: 1,
                    advanceAmount: 1,
                    tariff: 1,
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);
    }

    const rentalCountPromise = Rental.find({
        status: 'INACTIVE',
        rentalType: "MONTHLY"
    }).count();

    let [rentalObject, count] =  await Promise.all([rentalObjectPromise, rentalCountPromise])

    const rentals = formatIssueDateAndReturnDate(rentalObject)

    return {
        rentals,
        count
    }

}


RentalSchema.statics.findInActiveRentalByCustomerAndCount = async function (skip:number, limit:number, customerId) {
    const rentalByCustomerPromise = Rental.aggregate([
        {
            $match: {
                customer: new mongoose.Types.ObjectId(customerId),
                status: 'INACTIVE',
            }
        },
        ...fetchRentalQuery,
        {
            $project: {
                regNo: "$vehicle.regNo",
                issueDate: 1,
                advanceAmount: 1,
                tariff: 1,
                balance: 1,
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }
    ])

    const rentalByCustomerCountPromise = Rental.find({
        customer: customerId,
        status: 'INACTIVE'
    }).count();

    const [rentalByCustomer, count] = await Promise.all([rentalByCustomerPromise, rentalByCustomerCountPromise])
    const rentals = formatIssueDateAndReturnDate(rentalByCustomer);

    return {
        rentals,
        count
    }
}

RentalSchema.statics.findActiveRentalByCustomerAndCount = async function (skip:number, limit:number, customerId) {
    const rentalByCustomerPromise = Rental.aggregate([
                {
                    $match: {
                        customer: new mongoose.Types.ObjectId(customerId),
                        status: 'ACTIVE',
                    }
                },
        ...fetchRentalQuery,
                {
                    $project: {
                        regNo: "$vehicle.regNo",
                        issueDate: 1,
                        advanceAmount: 1,
                        tariff: 1,
                        balance: 1,
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ])

    const rentalByCustomerCountPromise = Rental.find({
        customer: customerId,
        status: 'ACTIVE'
    }).count();

    const [rentalByCustomer, count] = await Promise.all([rentalByCustomerPromise, rentalByCustomerCountPromise])
    const rentals = formatIssueDateAndReturnDate(rentalByCustomer);

    return {
        rentals,
        count
    }
}


const Rental = model<IRental, RentalModel>('rental', RentalSchema);

export default Rental;
