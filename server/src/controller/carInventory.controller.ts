import {IController} from "../interface";
import {NextFunction, Request, Response, Router} from "express";
import cloudinary from '../lib/cloudinary';
import upload from "../middleware/multer";
import CarInventory from "../model/carInventory";
import mongoose from "mongoose";

class CarInventoryController implements IController {
    path = '/car-inventory';
    router = Router();

    constructor() {
        this.router
            .get(`${this.path}-csv`, this.forCsvFile)
            .get(`${this.path}`, this.index)
            .get(`${this.path}-options`, this.carInventoryOption)
            .get(`${this.path}-all-options`, this.allCarInventoryOptions)
            .get(`${this.path}/:carInventoryId`, this.show)
            .post(`${this.path}`, upload.array('documents', 10), this.create )
            .put(`${this.path}/:carInventoryId`, this.update)
            .delete(`${this.path}/:carInventoryId`, this.delete)
    }

    private forCsvFile = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            let carInventory = await CarInventory.aggregate([
                {
                    $project: {
                        _id: 0,
                        regNo: 1,
                        brand: "$brandName",
                        model: "$modelName",
                        year: "$yearName",
                        tariff: 1,
                        status: 1
                    }
                }
            ]);
            const carInventoryObject = carInventory.map(( car ) => {
                let obj = {
                    regNo: car.regNo,
                    brand: car.brand,
                    model: car.model,
                    year: car.year,
                    ...car
                }
                return Object.values(obj)
            })
            res.status(200).json(carInventoryObject);
        } catch (e) {
            next(e);
        }
    }

    private index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            let result: {carInventory: object[], count: object};
            const { search } = req.query
            if (search) {
                result = await CarInventory.findCarInventoryAndCount(size * pageNo, size, search.toString());

            } else {
               result = await CarInventory.findCarInventoryAndCount(size * pageNo, size);
            }

            res.status(200).json({
                table: result.carInventory,
                count: result.count
            });

        } catch (e) {
            next(e);
        }
    }


    private allCarInventoryOptions = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const carInventory = await CarInventory.aggregate([
                {
                    $project: {
                        "_id": 0,
                        label: "$regNo",
                        value: "$_id",
                        tariff: 1
                    }
                }
            ])
            res.status(200).json(carInventory);
        } catch (e) {
            next(e);
        }
    }


    private carInventoryOption = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const carInventory = await CarInventory.aggregate([
                {
                  $match: {
                      status: 'AVAILABLE'
                  }
                },
                {
                    $project: {
                        "_id": 0,
                        label: "$regNo",
                        value: "$_id",
                        tariff: 1
                    }
                }
            ])
            res.status(200).json(carInventory);
        } catch (e) {
            next(e);
        }
    }

    private show = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { carInventoryId } = req.params;
            const carInventory = await CarInventory.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(carInventoryId)
                    }
                },
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'brand',
                        foreignField: '_id',
                        as: 'brand'
                    }
                },
                {
                    $unwind: '$brand'
                },
                {
                    $lookup: {
                        from: 'models',
                        localField: 'model',
                        foreignField: '_id',
                        as: 'model'
                    }
                },
                {
                    $unwind: '$model'
                },
                {
                    $lookup: {
                        from: 'years',
                        localField: 'year',
                        foreignField: '_id',
                        as: 'year'
                    }
                },
                {
                    $unwind: '$year'
                },
                {
                    $project: {
                        brand: {
                            label: "$brand.name",
                            value: "$brand._id"
                        },
                        model: {
                            label: "$model.name",
                            value: "$model._id"
                        },
                        year: {
                            label: "$year.name",
                            value: "$year._id"
                        },
                        regNo: 1,
                        color: 1,
                        horsePower: 1,
                        transmission: 1,
                        tariff: 1
                    }
                }
            ])
            res.status(200).json(carInventory[0])
        } catch (e) {
            next(e);
        }
    }

    private create = async ( req: Request, res: Response, next: NextFunction) => {
        try {
           req.body.documents = req.files;
            const documentsPromise = req.body.documents.map( (img: { path: string} ) => {
                return cloudinary.v2.uploader.upload(img.path);
            });
            const documentsResolved = await Promise.all(documentsPromise);
            const documents = documentsResolved.map((img) => {
                return {
                    avatar: img.secure_url,
                    cloudinary_id: img.public_id
                }
            });
            await CarInventory.create({
                ...req.body,
                brandName: req.body.brandName,
                modelName: req.body.modelName,
                yearName: req.body.yearName,
                documents
            })
           res.status(200).json({ saved: true })
        } catch (e) {
            next(e);
        }
    }

    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { carInventoryId } = req.params;
            await CarInventory.findByIdAndUpdate(carInventoryId, {
                ...req.body,
                brandName: req.body.brandName,
                modelName: req.body.modelName,
                yearName: req.body.yearName,
            });
            res.status(200).json({ updated: true })
        } catch (e) {
            next(e);
        }
    }

    private delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { carInventoryId } = req.params;
            const carInventory = await CarInventory.findById(carInventoryId);
            if (carInventory.status === 'AVAILABLE') {
                for (const img of carInventory.documents) {
                    await cloudinary.v2.uploader.destroy(img.cloudinary_id);
                }
                await CarInventory.findByIdAndDelete(carInventoryId)
                res.status(200).json({ deleted: true })
            } else {
                res.status(400).json({
                    status: 'Error',
                    message: 'This vehicle is currently rented',
                })
            }

        } catch (e) {
            next(e);
        }
    }
}

export default CarInventoryController;

