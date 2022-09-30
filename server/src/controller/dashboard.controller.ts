import {IController} from "../interface";
import {NextFunction, Request, Response, Router} from "express";
import CarInventory from "../model/carInventory";
import Payment from "../model/payment";
import moment from "moment";
import { checkIfNull } from "../lib/helper";
import Expense from "../model/expense";

class DashboardController implements IController {
    path =  '/dashboard'
    router = Router()

    constructor() {
        this.router
            .get(`${this.path}`, this.showByRental)
    }

    private showByRental = async ( _req: Request, res: Response, next: NextFunction) => {
        try {

            const totalCarsPromise = CarInventory.find().count();
            const totalActiveCarsPromise = CarInventory.find({
                status: 'UNAVAILABLE'
            }).count();

            const totalInActiveCarsPromise = CarInventory.find({
                status: 'AVAILABLE',
            }).count();

            const dailyIncomePromise = Payment.aggregate([
                {
                    $match: {
                        issueDate: {
                            $gte: moment().utc(false).startOf('day').toDate(),
                            $lt: moment().utc(false).endOf('day').toDate()
                        }
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

            const monthlyIncomePromise = Payment.aggregate([
                {
                    $match: {
                        issueDate: {
                            $gte: moment().utc(false).startOf('week').toDate(),
                            $lt: moment().utc(false).endOf('week').toDate()
                        }
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
            ])

            const monthlyExpensePromise = Expense.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: moment().utc(false).startOf('month').toDate(),
                            $lt: moment().utc(false).endOf('month').toDate()
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        sum: {
                            "$sum": "$totalExpense"
                        }
                    }
                }
            ])


            const [totalCars, totalActiveCars, totalInActiveCars, dailyIncome, monthlyIncome, monthlyExpense]
                = await Promise.all([totalCarsPromise, totalActiveCarsPromise,
                totalInActiveCarsPromise, dailyIncomePromise, monthlyIncomePromise, monthlyExpensePromise]);

            let tDailyIncome = checkIfNull(dailyIncome, "sum");
            let tMonthlyIncome= checkIfNull(monthlyIncome, "sum");
            let tMonthlyExpense = checkIfNull(monthlyExpense, "sum");

            res.status(200).json({
                totalCars, totalActiveCars, totalInActiveCars,
                dailyIncome: tDailyIncome, monthlyIncome: tMonthlyIncome, monthlyExpense: tMonthlyExpense
            })
        } catch (e) {
            next(e);
        }
    }
}

export default DashboardController;
