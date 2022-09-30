import {IController} from "../interface";
import {NextFunction, Request, Response, Router} from "express";
import Payment from "../model/payment";
import Rental from "../model/rental";
import mongoose from "mongoose";
import { formatAMPM } from "../lib/helper";

class PaymentController implements IController {
    path = '/payment';
    router = Router();
    constructor() {
        this.router
            .get(`${this.path}-sum/:rentalId`, this.getSum)
            .get(`${this.path}/:rentalId`, this.index)
            .post(`${this.path}`, this.create)
    }

    private getSum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rentalId } = req.params;
            const rentalSum = await Rental.findById(rentalId).select('-_id balance')
            res.status(200).json(rentalSum.balance);
        } catch (e) {
            next(e);
        }
    }

    private index = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rentalId } = req.params;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const paymentPromise = Payment.aggregate([
                {
                    $match: {
                        rental: new mongoose.Types.ObjectId(rentalId)
                    }
                },
                {
                    $lookup: {
                        from: 'rentals',
                        localField: 'rental',
                        foreignField: '_id',
                        as: 'rental'
                    }
                },
                {
                  $unwind: '$rental'
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
                    $unwind: '$vehicle'
                },

                {
                    $project: {
                        regNo: "$vehicle.regNo",
                        issueDate: 1,
                        receiverName: 1,
                        discount: 1,
                        paid: 1,
                    }
                },
                {
                    $skip: size * pageNo
                },
                {
                    $limit: size
                }
            ])
            const paymentCountPromise = Payment.find({
                rental: rentalId
            }).count()
            const [paymentObject, paymentCount] = await Promise.all([paymentPromise, paymentCountPromise])
            const payment = paymentObject.map((payment) => {
                payment.issueDate = formatAMPM(payment.issueDate)
                let obj =  {
                    _id: payment._id,
                    issueDate: payment.issueDate,
                    regNo: payment.regNo,
                    receiverName: payment.receiverName,
                    paid: payment.paid,
                    discount: payment.discount
                }
                return Object.values(obj)
            })

            res.status(200).json({ table: payment, count: paymentCount})
        } catch (e) {
            next(e);
        }
    }

    private create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rental = await Rental.findById(req.body.rental);
            if (rental) {
                rental.balance -= parseInt(req.body.paid);
                await rental.save();
                await Payment.create({
                    ...req.body,
                    balance: rental.balance,
                    customer: rental.customer,
                    vehicle: rental.vehicle
                });
            }

            res.status(200).json({ saved: true })
        } catch (e) {
            next(e);
        }
    }
}

export default PaymentController;
