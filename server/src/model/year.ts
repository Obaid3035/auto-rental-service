import {Schema, model, Model} from "mongoose";
import {IBrand, IModel, ITree, IYear} from "../interface";

interface VehicleModel extends Model<IYear>{
    getTreeStructure(brands: IBrand[], models: IModel[], years: IYear[]): Promise<ITree[]>,
}

const YearSchema: Schema<IYear> = new Schema({
    name: {
        type: String,
        required: true
    },
    model: {
        type: Schema.Types.ObjectId,
        ref: 'model',
        required: true
    }
});

YearSchema.statics.getTreeStructure = async function (brands: IBrand[], models: IModel[], years: IYear[]) {
    return brands.map(brand => {
        return {
            id: `${brand._id}-brand`,
            name: brand.name,
            children: models.length > 0 ? models.filter((model: any) => {
                    return model.brand.toString() === brand._id.toString();
                }).map((model: any) => {
                    return {
                        id: `${model._id}-model`,
                        name: model.name,
                        children: years.length > 0 ? years.filter((year: any) => {
                            return year.model.toString() === model._id.toString();
                        }).map((year: any) => {
                            return {
                                id: `${year._id}-year`,
                                name: year.name,
                            }
                        }) : []
                    }
                })
                : []
        }
    })
}

const Year = model<IYear, VehicleModel>('year', YearSchema);

export default Year;
