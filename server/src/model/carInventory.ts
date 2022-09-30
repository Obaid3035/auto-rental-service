import {Schema, model, Model} from "mongoose";
import {ICarInventory} from "../interface";


interface CarInventoryModel extends Model<ICarInventory>{
    findCarInventoryAndCount(skip: number, limit: number, search?: string): Promise<{count: object, carInventory: object[]}>,
}

const CarInventorySchema: Schema<ICarInventory> = new Schema({
    regNo: {
        type: String,
        required: true
    },

    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brand',
        required: true
    },
    model: {
        type: Schema.Types.ObjectId,
        ref: 'model',
        required: true
    },
    year: {
        type: Schema.Types.ObjectId,
        ref: 'year',
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    yearName: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    horsePower: {
        type: String,
    },
    transmission: {
        type: String,
    },
    tariff: {
        type: Number,
        required: true
    },
    documents: [{
            avatar: {
                type: String,
            },
            cloudinary_id: {
                type: String,
            }
        }],
    status: {
        type: String,
        enum : ['AVAILABLE','UNAVAILABLE'],
        default: 'AVAILABLE'
    }

}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
})

CarInventorySchema.index({
    regNo: "text",
    brandName: "text",
    modelName: "text",
    yearName: "text"
})



CarInventorySchema.statics.findCarInventoryAndCount = async function ( skip:number, limit:number, search?: string) {
    let carInventoryObjectPromise = CarInventory.aggregate([
        {
            $project: {
                regNo: 1,
                brand: "$brandName",
                model: "$modelName",
                year: "$yearName",
                tariff: 1,
                status: 1
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

        carInventoryObjectPromise = CarInventory.aggregate([
            {
              $match: {
                  $text: {
                      $search: "\"" + search + "\""
                  },
              }
            },
            {
                $project: {
                    regNo: 1,
                    brand: "$brandName",
                    model: "$modelName",
                    year: "$yearName",
                    tariff: 1,
                    status: 1
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

    const carInventoryCountPromise = CarInventory.find().count();
    const [carInventoryObject, count] =  await Promise.all([carInventoryObjectPromise, carInventoryCountPromise]);
    const carInventory = carInventoryObject.map(( car ) => {
        let obj = {
            _id: car._id,
            regNo: car.regNo,
            brand: car.brand,
            model: car.model,
            year: car.year,
            ...car
        }
        return Object.values(obj)
    })
    return {
        carInventory,
        count
    }
}

const CarInventory = model<ICarInventory, CarInventoryModel>('carInventory', CarInventorySchema);

export default CarInventory;
