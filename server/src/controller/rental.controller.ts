import {IController} from "../interface";
import {NextFunction, Request, Response, Router} from "express";
import Rental, {fetchRentalQuery} from "../model/rental";
import {formatIssueDateAndReturnDate, formatAMPM, checkIfNull} from "../lib/helper"
import CarInventory from "../model/carInventory";
import Payment from "../model/payment";
import mongoose from "mongoose";
import moment from "moment";

class RentalController implements IController {
    path = '/rental';
    router = Router();
    constructor() {
        this.router
            .get(`/inactive-rental-daily-csv`, this.forInActiveDailyRentalCsvFile)
            .get(`/inactive-rental-monthly-csv`, this.forInActiveMonthlyRentalCsvFile)
            .get(`/active-rental-daily-csv`, this.forActiveDailyRentalCsvFile)
            .get(`/active-rental-monthly-csv`, this.forActiveMonthlyRentalCsvFile)
            .get(`${this.path}/:rentalId`, this.show)
            .get(`${this.path}-balance/:rentalId`, this.showBalance)
            .post(`${this.path}/:rentalId`, this.closeRental)
            .get(`${this.path}-inactive-daily`, this.inActiveDailyRental)
            .get(`${this.path}-inactive-monthly`, this.inActiveMonthlyRental)
            .get(`${this.path}-active-daily`, this.activeDailyRental)
            .get(`${this.path}-active-monthly`, this.activeMonthlyRental)
            .post(`${this.path}`, this.create)
            .put(`${this.path}/:rentalId`, this.update)
            .put(`${this.path}-monthly-incremental`, this.monthlyRentalIncremental)
            .put(`${this.path}-daily-incremental`, this.dailyRentalIncremental)
            .delete(`${this.path}/:rentalId`, this.deleteRental)
    }

    private forInActiveDailyRentalCsvFile = async ( _req: Request, res: Response, next: NextFunction) => {
        try {
            const rentals = await Rental.aggregate([
                {
                    $match: {
                        status: 'INACTIVE',
                        rentalCharge: "DAILY"
                    }
                },
                ...fetchRentalQuery,
                {
                    $project: {
                        _id: 0,
                        regNo: "$vehicle.regNo",
                        customer: "$customer.name",
                        issueDate: 1,
                        balance: 1,
                        advanceAmount: 1,
                        tariff: 1,
                    }
                }
            ]);

            const rentalsObject = formatIssueDateAndReturnDate(rentals, true)


            res.status(200).json(rentalsObject)
        } catch (e) {
            next(e);
        }
    }
    private forInActiveMonthlyRentalCsvFile = async ( _req: Request, res: Response, next: NextFunction) => {
        try {
            const rentals = await Rental.aggregate([
                {
                    $match: {
                        status: 'INACTIVE',
                        rentalCharge: "MONTHLY"
                    }
                },
                ...fetchRentalQuery,
                {
                    $project: {
                        _id: 0,
                        regNo: "$vehicle.regNo",
                        customer: "$customer.name",
                        issueDate: 1,
                        balance: 1,
                        advanceAmount: 1,
                        tariff: 1,
                    }
                }
            ]);

            const rentalsObject = formatIssueDateAndReturnDate(rentals, true)


            res.status(200).json(rentalsObject)
        } catch (e) {
            next(e);
        }
    }

    private forActiveDailyRentalCsvFile = async ( _req: Request, res: Response, next: NextFunction) => {
        try {
            const rentals = await Rental.aggregate([
                {
                    $match: {
                        status: 'ACTIVE',
                        rentalCharge: "DAILY"
                    }
                },
                ...fetchRentalQuery,
                {
                    $project: {
                        _id: 0,
                        regNo: "$vehicle.regNo",
                        customer: "$customer.name",
                        issueDate: 1,
                        deadline: 1,
                        balance: 1,
                        advanceAmount: 1,
                        tariff: 1,
                    }
                }
            ]);

            const rentalsObject = formatIssueDateAndReturnDate(rentals, true)


            res.status(200).json(rentalsObject)
        } catch (e) {
            next(e);
        }
    }
    private forActiveMonthlyRentalCsvFile = async ( _req: Request, res: Response, next: NextFunction) => {
        try {
            const rentals = await Rental.aggregate([
                {
                    $match: {
                        status: 'ACTIVE',
                        rentalCharge: "MONTHLY"
                    }
                },
                ...fetchRentalQuery,
                {
                    $project: {
                        _id: 0,
                        regNo: "$vehicle.regNo",
                        customer: "$customer.name",
                        issueDate: 1,
                        balance: 1,
                        advanceAmount: 1,
                        tariff: 1,
                    }
                }
            ]);

            const rentalsObject = formatIssueDateAndReturnDate(rentals, true)


            res.status(200).json(rentalsObject)
        } catch (e) {
            next(e);
        }
    }

    private activeMonthlyRental = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const { search } = req.query;
            let result: {rentals: object[], count: object};
            if (search) {
                result = await Rental.findActiveMonthlyRentalAndCount(size * pageNo, size, search.toString())
            } else {
                result = await Rental.findActiveMonthlyRentalAndCount(size * pageNo, size)
            }
            res.status(200).json({
                table: result.rentals,
                count: result.count
            })
        } catch (e) {
            next(e);
        }
    }

    private activeDailyRental = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const { search } = req.query;
            let result: {rentals: object[], count: object};
            if (search) {
                result = await Rental.findActiveDailyRentalAndCount(size * pageNo, size, search.toString())
            } else {
                result = await Rental.findActiveDailyRentalAndCount(size * pageNo, size)
            }
            res.status(200).json({
                table: result.rentals,
                count: result.count
            })
        } catch (e) {
            next(e);
        }
    }

    private show = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { rentalId } = req.params
            const rental = await Rental.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(rentalId)
                    }
                },
                ...fetchRentalQuery,
                {
                    $lookup: {
                        from: 'brands',
                        localField: 'vehicle.brand',
                        foreignField: '_id',
                        as: 'brand'
                    }
                },
                {
                    $unwind: "$brand"
                },

                {
                    $lookup: {
                        from: 'models',
                        localField: 'vehicle.model',
                        foreignField: '_id',
                        as: 'model'
                    }
                },
                {
                    $unwind: "$model"
                },
                {
                    $lookup: {
                        from: 'years',
                        localField: 'vehicle.year',
                        foreignField: '_id',
                        as: 'year'
                    }
                },
                {
                    $unwind: "$year"
                },
                {
                    $project: {
                        regNo: "$vehicle.regNo",
                        customer: "$customer.name",
                        vehicle: {
                            $concat: ["$brand.name", " ", "$model.name", " ", "$year.name"]
                        },
                        issueDate: 1,
                        returnDate: 1,
                        SON: 1,
                        book: 1,
                        rentalType: 1,
                        deadline: 1,
                        paymentType: 1,
                        status: 1,
                        balance: 1,
                        advanceAmount: 1,
                        tariff: 1,
                    }
                }
            ])
            rental[0].issueDate = formatAMPM(rental[0].issueDate)
            rental[0].returnDate = formatAMPM(rental[0].returnDate)
            res.status(200).json(rental[0])
        } catch (e) {
            next(e);
        }
    }

    private update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rentalId } = req.params;
            const { vehicleId, tariff } = req.body;
            const newVehicle = await CarInventory.findById(vehicleId);
            newVehicle.status = 'UNAVAILABLE'

            const rental = await Rental.findById(rentalId);
            const updatedCar = await CarInventory.findByIdAndUpdate(rental.vehicle, {
                status: 'AVAILABLE'
            })
            const updatedRental = await Rental.findByIdAndUpdate(rentalId, {
                vehicle: newVehicle._id,
                tariff: tariff
            })
            if (updatedCar && updatedRental) {
                await newVehicle.save();
            }
            res.status(200).json({ saved: true })
        } catch (e) {
            next(e);
        }
    }

    private inActiveDailyRental = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const { search } = req.query;
            let result: {rentals: object[], count: object};
            if (search) {
                result = await Rental.findInActiveDailyRentalAndCount(size * pageNo, size, search.toString())
            } else {
                result = await Rental.findInActiveDailyRentalAndCount(size * pageNo, size)
            }
            res.status(200).json({
                table: result.rentals,
                count: result.count
            })
        } catch (e) {
            next(e);
        }
    }

    private inActiveMonthlyRental = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const { search } = req.query;
            let result: {rentals: object[], count: object};
            if (search) {
                result = await Rental.findInActiveMonthlyRentalAndCount(size * pageNo, size, search.toString())
            } else {
                result = await Rental.findInActiveMonthlyRentalAndCount(size * pageNo, size)
            }
            res.status(200).json({
                table: result.rentals,
                count: result.count
            })
        } catch (e) {
            next(e);
        }
    }

    private closeRental = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { rentalId} = req.params;
            const rental = await Rental.findById(rentalId)
            await Payment.create({
                rental: rentalId,
                customer: rental.customer,
                vehicle: rental.vehicle,
                issueDate: req.body.issueDate,
                receiverName: req.body.receiverName,
                paid: req.body.paid,
                discount: req.body.discount,
                balance: req.body.totalBalance
            })
            rental.status = 'INACTIVE';
            rental.balance = req.body.totalBalance;
            const rentalSave = rental.save();
            const vehicle =  CarInventory.findByIdAndUpdate(rental.vehicle, {
                status: 'AVAILABLE',
            })
            await Promise.all([vehicle, rentalSave])
            res.status(200).json({ saved: true})
        } catch (e) {
            next(e);
        }
    }

    private showBalance = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { rentalId} = req.params;
            const rental = await Rental.findById(rentalId).select('balance');
            res.status(200).json({balance: rental.balance})
        } catch (e) {
            next(e);
        }
    }

    private create = async ( req: Request, res: Response, next: NextFunction) => {
        try {

            const carInventoryPromise = CarInventory.findByIdAndUpdate(req.body.vehicle, {
                status: 'UNAVAILABLE'
            })
            const rentalPromise =  Rental.create({
                ...req.body,
                deadline: req.body.issueDate,
            });
            const [rental] = await Promise.all([rentalPromise, carInventoryPromise])
            await Payment.create({
                rental: rental._id,
                issueDate: req.body.issueDate,
                balance: req.body.balance,
                receiverName: 'Admin',
                paid: req.body.advanceAmount,
                customer: rental.customer,
                vehicle: rental.vehicle
            })
            res.status(200).json({ saved: true})
        } catch (e) {
            next(e);
        }
    }

    private monthlyRentalIncremental =  async (_req: Request, res: Response, next: NextFunction) => {
        try {
            let now = moment().utc(false).hours(14).minutes(5).seconds(0);
            const rentals = await Rental.find({
                status: 'ACTIVE',
                rentalCharge: "MONTHLY",
            })

            for (const rental of rentals) {
                const issueDate = moment(rental.issueDate);
                let months = now.diff(issueDate, 'months')
                const payments = await Payment.aggregate([
                    {
                        $match: {
                            rental: rental._id
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            sum: {
                                "$sum": "$paid"
                            }
                        }
                    }
                ]);
                const allPaymentsSum = checkIfNull(payments, 'sum')
                const updatedBalance =  (months * rental.tariff) - allPaymentsSum

                let deadline = moment().utc(false).add(1, 'months').hours(14).minutes(0).seconds(0).toDate();
                await Rental.updateMany({
                    _id: rental._id
                }, {
                    balance: updatedBalance,
                    deadline
                })
            }
            res.status(200).json({saved: true})

        } catch (e) {
            next(e);
        }
    }

    private dailyRentalIncremental = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            let now = moment().utc(false).hours(14).minutes(5).seconds(0);
            const rentals = await Rental.find({
                status: 'ACTIVE',
                rentalCharge: "DAILY",
            })

            for (const rental of rentals) {
                const issueDate = moment(rental.issueDate);
                let days = now.diff(issueDate, 'days') + 1
                const payments = await Payment.aggregate([
                    {
                        $match: {
                            rental: rental._id
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            sum: {
                                "$sum": "$paid"
                            }
                        }
                    }
                ]);
                const allPaymentsSum = checkIfNull(payments, 'sum')
                const updatedBalance =  (days * rental.tariff) - allPaymentsSum

                let deadline = moment().utc(false).add(1, 'days').hours(14).minutes(0).seconds(0).toDate();
                await Rental.updateMany({
                    _id: rental._id
                }, {
                    balance: updatedBalance,
                    deadline
                })
            }
            res.status(200).json({saved: true})

        } catch (e) {
            next(e);
        }
    }

    async deleteRental(req: Request, res: Response, next: NextFunction) {
        try {
            const { rentalId } = req.params;
            const rental = await Rental.findById(rentalId);
           if (!rental) {
               res.status(400).json({message: 'rental not found'})
           }
            const deleted = await Payment.deleteMany({
                rental: rental._id
            })
            if (!deleted) {
                res.status(400).json({message: 'something went wrong'})
            }
            const updated = await CarInventory.findByIdAndUpdate(rental.vehicle, {
                status: "AVAILABLE"
            })
            if (!updated) {
                res.status(400).json({message: 'something went wrong'})
            }
            await rental.delete();
            res.status(200).json({delete: true})
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

export default RentalController;
