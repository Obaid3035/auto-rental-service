import {IController, ITree} from "../interface";
import { NextFunction, Request, Response, Router } from "express";
import Brand from "../model/brand";
import Model from "../model/model";
import Year from "../model/year";
import mongoose from "mongoose";
import CarInventory from "../model/carInventory";

class VehicleController implements IController {
    path = '/vehicle';
    router = Router();

    constructor() {
        this.router
            .get(`${this.path}`, this.index)
            .put(`${this.path}/:vehicleId`, this.update)
            .get(`${this.path}/year-options/:modelId`, this.fetchYearOptionsByModel)
            .get(`${this.path}/model-options/:brandId`, this.fetchModelOptionsByBrand)
            .get(`${this.path}/brand-options`, this.fetchBrandOptions)
            .get(`${this.path}/model-options`, this.fetchModelOptions)
            .post(`${this.path}/brand`, this.createBrand)
            .post(`${this.path}/model/:brand`, this.createModel)
            .post(`${this.path}/year/:model`, this.createYear)
    }


    private index = async ( _req: Request, res: Response, next: NextFunction) => {
        try {

            let brandPromise =  Brand.find();
            let modelPromise =  Model.find();
            let yearPromise =  Year.find();

            let [brands, models, years] = await Promise.all([brandPromise, modelPromise, yearPromise])

            const tree: ITree[] = await Year.getTreeStructure(brands, models, years);
            res.status(200).json(tree)
        } catch (e) {
            next(e);
        }
    }


    private update = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { vehicleId } = req.params
            const  [ id, resourceName] = vehicleId.split('-');
            const { name } = req.body;
            switch (resourceName) {
                case 'brand':
                    const brandPromise = Brand.findByIdAndUpdate(id, {
                        name
                    })
                   const vehicleBrandPromise = CarInventory.updateMany({
                        brand: id
                    }, {
                       brandName: name
                   });
                    await Promise.all([brandPromise, vehicleBrandPromise])
                    break;
                case 'model':
                    const modelPromise = Model.findByIdAndUpdate(id, {
                        name
                    })
                    const vehicleModelPromise = CarInventory.updateMany({
                        model: id
                    }, {
                        modelName: name
                    });
                    await Promise.all([modelPromise, vehicleModelPromise])

                    break;
                case 'year':
                    const yearPromise = Year.findByIdAndUpdate(id, {
                        name
                    })
                    const vehicleYearPromise = CarInventory.updateMany({
                        year: id
                    }, {
                        yearName: name
                    });
                    await Promise.all([yearPromise, vehicleYearPromise]);
                    break;
            }
            res.status(200).json({ saved: true})
        } catch (e) {
            next(e);
        }
    }

    private createBrand = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            await Brand.create({
                name: req.body.name
            });
            res.status(200).json({ saved: true})
        } catch (e) {
            next(e);
        }
    }

    private createModel = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { brand } = req.params;
            const { name } = req.body;

            await Model.create({
                name,
                brand
            });
            res.status(200).json({ saved: true})
        } catch (e) {
            next(e);
        }
    }

    private createYear = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { model } = req.params;
            const { name } = req.body;

            await Year.create({
                name,
                model
            });
            res.status(200).json({ saved: true})
        } catch (e) {
            next(e);
        }
    }

    private fetchBrandOptions = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const brandsOption = await Brand.aggregate([
                {
                    $project: {
                        "_id": 0,
                        label: "$name",
                        value: "$_id",
                    }
                }
            ])
            res.status(200).json(brandsOption)
        } catch (e) {
            next(e);
        }
    }
    private fetchModelOptions = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const modelsOption = await Model.aggregate([
                {
                    $project: {
                        "_id": 0,
                        label: "$name",
                        value: "$_id",
                    }
                }
            ])
            res.status(200).json(modelsOption)
        } catch (e) {
            next(e);
        }
    }

    private fetchModelOptionsByBrand = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { brandId } = req.params;
            const modelsOption = await Model.aggregate([
                {
                  $match: {
                      brand: new mongoose.Types.ObjectId(brandId)
                  }
                },
                {
                    $project: {
                        "_id": 0,
                        label: "$name",
                        value: "$_id",
                    }
                }
            ])
            res.status(200).json(modelsOption)
        } catch (e) {
            next(e);
        }
    }

    private fetchYearOptionsByModel = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { modelId } = req.params;
            const yearOption = await Year.aggregate([
                {
                    $match: {
                        model: new mongoose.Types.ObjectId(modelId)
                    }
                },
                {
                    $project: {
                        "_id": 0,
                        label: "$name",
                        value: "$_id",
                    }
                }
            ])
            res.status(200).json(yearOption)
        } catch (e) {
            next(e);
        }
    }
}

export default VehicleController;
