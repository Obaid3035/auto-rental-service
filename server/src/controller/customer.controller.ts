import {NextFunction, Request, Response, Router} from "express";
import { IController } from "../interface";
import Customer from "../model/customer";
import Rental from "../model/rental";
import mongoose from "mongoose";

class CustomerController implements IController{
    path =  '/customer'
    router = Router()

    constructor() {
        this.router
            .get(`${this.path}-csv`, this.forCsvFile)
            .post(`${this.path}`, this.create)
            .get(`${this.path}-inactive-rental/:customerId`, this.showByInActiveRental)
            .get(`${this.path}-rental-count/:customerId`, this.showCustomerAndRentalCount)
            .get(`${this.path}-rental/:customerId`, this.showByRental)
            .get(`${this.path}`, this.index)
            .get(`${this.path}-options`, this.customerOptions)
            .get(`${this.path}/:customerId`, this.show)
            .put(`${this.path}/:customerId`, this.update)
    }

    private forCsvFile = async ( _req: Request, res: Response, next: NextFunction) => {
        try {
            const customers = await Customer.aggregate([
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        phone: 1,
                        cnic: 1
                    }
                }
            ])

            const customersObject = customers.map((i:any) => {
                return Object.values(i)
            });


            res.status(200).json(customersObject)
        } catch (e) {
            next(e);
        }
    }


    private index = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const { search } = req.query;
            let result: {customers: object[], count: object};
            if (search) {
                result = await Customer.findCustomerAndCount(size * pageNo, size, search.toString());
            } else {
                 result = await Customer.findCustomerAndCount(size * pageNo, size);
            }

            res.status(200).json({
                table: result.customers,
                count: result.count
            })
        } catch (e) {
            next(e);
        }
    }

    private showByRental = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId } = req.params;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const { rentals, count } = await Rental.findActiveRentalByCustomerAndCount(size * pageNo, size, customerId)
            res.status(200).json({
                table: rentals,
                count
            })
        } catch (e) {
            next(e);
        }
    }

    private showByInActiveRental = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId } = req.params;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const { rentals, count } = await Rental.findInActiveRentalByCustomerAndCount(size * pageNo, size, customerId)
            res.status(200).json({
                table: rentals,
                count
            })
        } catch (e) {
            next(e);
        }
    }

    private showCustomerAndRentalCount = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId } = req.params;
            const customerPromise =  Customer.findById(customerId).select('name cnic phone residentialAddress');
            const rentalCountPromise = Rental.find({
                customer: customerId,
                status: 'ACTIVE'
            }).count();
            const rentalTotalBalancePromise = Rental.aggregate([
                {
                  $match: {
                      customer: new mongoose.Types.ObjectId(customerId),
                  }
                },
                {
                    $group: {
                        _id: null,
                        sum: {
                            $sum: "$balance"
                        }
                    }
                }
            ])
            const [customer, rentalCount, rentalTotalBalance] = await Promise.all([customerPromise, rentalCountPromise, rentalTotalBalancePromise]);
            let sum = 0;
            if (rentalTotalBalance[0] &&  rentalTotalBalance[0].sum) {
                sum =  rentalTotalBalance[0].sum
            }


            res.status(200).json({
                customer,
                count: rentalCount,
                totalBalance: sum
            })
        } catch (e) {
            next(e);
        }
    }

    private show = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId } = req.params;
           const customer = await Customer.findById(customerId);
            res.status(200).json(customer)
        } catch (e) {
            next(e);
        }
    }

    private create = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            await Customer.customerExist(req.body.cnic)
            await Customer.create(req.body);
            res.status(200).json({ saved: true})
        } catch (e) {
            next(e);
        }
    }

    private update = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { customerId } = req.params;
            await Customer.findByIdAndUpdate(customerId, {
                ...req.body
            });
            res.status(200).json({ updated: true })
        } catch (e) {
            next(e);
        }
    }

    private customerOptions = async ( _req: Request, res: Response, next: NextFunction) => {
        try {
            const customerOption = await Customer.aggregate([
                {
                    $project: {
                        "_id": 0,
                        label: "$name",
                        value: "$_id"
                    }
                }
            ])
            res.status(200).json(customerOption)
        } catch (e) {
            next(e);
        }
    }
}

export default CustomerController;
