import Payment from "../model/payment";
import mongoose from "mongoose";
import moment from "moment";
import Expense from "../model/expense";
import {checkIfNull} from "../lib/helper";

export const getIncomeReport = async (vehicleId: string, startDate: string, endDate: string, size: number, pageNo: number) => {
    const paymentReportPromise = Payment.aggregate([
        {
            $match: {
                vehicle: new mongoose.Types.ObjectId(vehicleId),
                issueDate: {
                    $gte: moment(startDate.toString().slice(0, 10)).utc(true).toDate(),
                    $lte: moment(endDate.toString().slice(0, 10)).utc(true).add(1, 'days').toDate()
                }
            }
        },
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
            $group: {
                _id: {
                    customer: "$customer.name"
                },
                paid: {
                    $sum: "$paid"
                }
            }
        },
        {
            $project: {
                _id: 0,
                customer: "$_id.customer",
                paid: 1,
            }
        },
        {
            $skip: size * pageNo
        },
        {
            $limit: size
        }
    ]);

    const paymentReportCountPromise = Payment.aggregate([
        {
            $match: {
                vehicle: new mongoose.Types.ObjectId(vehicleId),
                issueDate: {
                    $gte: moment(startDate.toString().slice(0, 10)).utc(true).toDate(),
                    $lte: moment(endDate.toString().slice(0, 10)).utc(true).add(1, 'days').toDate()
                }
            }
        },
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
            $group: {
                _id: {
                    customer: "$customer.name"
                },
                paid: {
                    $sum: "$paid"
                }
            }
        },
        {
            $count: 'count'
        }
    ])

    let totalIncomePromise = Payment.aggregate([
        {
            $match: {
                vehicle: new mongoose.Types.ObjectId(vehicleId),
                issueDate: {
                    $gte: moment(startDate.toString().slice(0, 10)).utc(true).toDate(),
                    $lte: moment(endDate.toString().slice(0, 10)).utc(true).add(1, 'days').toDate()
                }
            }
        },
        {
            $group: {
                _id: null,
                sum: {
                    $sum: "$paid"
                }
            }
        }

    ])

    const [paymentReport, paymentReportCount, totalIncome] = await Promise.all([
            paymentReportPromise,
            paymentReportCountPromise,
            totalIncomePromise,
        ])

    let tIncome = checkIfNull(totalIncome, 'sum')
    let incomeCount = checkIfNull(paymentReportCount, 'count')

    const paymentReportMap = paymentReport.map(payment => {
        let obj = {
            customer: payment.customer,
            paid: payment.paid,
        }
        return Object.values(obj)
    })

    return {
        paymentReportMap,
        tIncome,
        incomeCount
    }

}


export const getExpenseReport = async (vehicleId: string, startDate: string, endDate: string, size: number, pageNo: number) => {

    let expenseReportPromise = Expense.aggregate([
        {
            $match: {
                vehicle: new mongoose.Types.ObjectId(vehicleId),
                expenseType: 'CAR_EXPENSE',
                createdAt: {
                    $gte: moment(startDate.toString().slice(0, 10)).utc(true).toDate(),
                    $lte: moment(endDate.toString().slice(0, 10)).utc(true).add(1, 'days').toDate()
                }
            }
        },
        {
            $unwind: '$allExpense'
        },
        {
            $skip: size * pageNo
        },
        {
            $limit: size
        },
        {
            $group: {
                _id: null,
                expenses: {
                    $push: "$allExpense"
                }
            }
        }
    ])

    const expenseReportCountPromise = Expense.aggregate([
        {
            $match: {
                vehicle: new mongoose.Types.ObjectId(vehicleId),
                expenseType: 'CAR_EXPENSE',
                createdAt: {
                    $gte: moment(startDate.toString().slice(0, 10)).utc(true).toDate(),
                    $lte: moment(endDate.toString().slice(0, 10)).utc(true).add(1, 'days').toDate()
                }
            }
        },
        {
            $unwind: '$allExpense'
        },
        {
            $count: 'count'
        }
    ])

    let totalExpensePromise = Expense.aggregate([
        {
          $match: {
              expenseType: 'CAR_EXPENSE',
              vehicle: new mongoose.Types.ObjectId(vehicleId),
              createdAt: {
                  $gte: moment(startDate.toString().slice(0, 10)).utc(true).toDate(),
                  $lte: moment(endDate.toString().slice(0, 10)).utc(true).add(1, 'days').toDate()
              }
          }
        },
        {
            $group: {
                _id: null,
                sum: {
                    $sum: "$totalExpense"
                }
            }
        }
    ])


    const [expenseReport, totalExpense, expenseReportCount] = await Promise.all([
        expenseReportPromise,
        totalExpensePromise,
        expenseReportCountPromise
    ])

    let expenseReportMap = [];
    if (expenseReport.length === 1) {
        expenseReportMap = expenseReport[0].expenses.map((expense: {description: string, amount: number}) => {
            let obj = {
                description: expense.description,
                amount: expense.amount,
            }
            return Object.values(obj)
        })
    }

    let tExpense = checkIfNull(totalExpense, 'sum');
    let expenseCount = checkIfNull(expenseReportCount, 'count')

    return {
        expenseReportMap,
        tExpense,
        expenseCount
    }
}


export const getGeneralReport = async (startDate: string, endDate: string, size: number, pageNo: number) => {

    let generalExpenseReportPromise = Expense.aggregate([
        {
            $match: {
                expenseType: 'GENERAL_EXPENSE',
                createdAt: {
                    $gte: moment(startDate.toString().slice(0, 10)).utc(true).toDate(),
                    $lte: moment(endDate.toString().slice(0, 10)).utc(true).add(1, 'days').toDate()
                }
            }
        },
        {
            $unwind: '$allExpense'
        },
        {
            $skip: size * pageNo
        },
        {
            $limit: size
        },
        {
            $group: {
                _id: null,
                expenses: {
                    $push: "$allExpense"
                }
            }
        }
    ])

    const generalExpenseReportCountPromise = Expense.aggregate([
        {
            $match: {
                expenseType: 'GENERAL_EXPENSE',
                createdAt: {
                    $gte: moment(startDate.toString().slice(0, 10)).utc(true).toDate(),
                    $lte: moment(endDate.toString().slice(0, 10)).utc(true).add(1, 'days').toDate()
                }
            }
        },
        {
            $unwind: '$allExpense'
        },
        {
            $count: 'count'
        }
    ])


    const totalIncomePromise = Payment.aggregate([
        {
            $group: {
                _id: null,
                sum: {
                    "$sum": "$paid"
                }
            }
        }
    ]);

    const totalGeneralExpensePromise = Expense.aggregate([
        {
            $match: {
                expenseType: 'GENERAL_EXPENSE'
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

    const totalCarExpensePromise = Expense.aggregate([
        {
            $match: {
                expenseType: 'CAR_EXPENSE'
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

    const [totalIncome, totalGeneralExpense, totalCarExpense, generalExpenseReport, generalExpenseReportCount ] =
        await Promise.all([totalIncomePromise, totalGeneralExpensePromise, totalCarExpensePromise, generalExpenseReportPromise, generalExpenseReportCountPromise]);

    let tIncome = checkIfNull(totalIncome, 'sum');
    let tGeneralExpense = checkIfNull(totalGeneralExpense, 'sum');
    let tCarExpense = checkIfNull(totalCarExpense, 'sum');
    let generalExpenseCount = checkIfNull(generalExpenseReportCount, 'count');

    let generalExpenseReportMap = [];
    if (generalExpenseReport.length === 1) {
        generalExpenseReportMap = generalExpenseReport[0].expenses.map((expense: {description: string, amount: number}) => {
            let obj = {
                description: expense.description,
                amount: expense.amount,
            }
            return Object.values(obj)
        })
    }

    return {
        generalExpenseReport: generalExpenseReportMap,
        generalExpenseCount,
        totalIncome: tIncome,
        totalGeneralExpense: tGeneralExpense,
        totalCarExpense: tCarExpense,
        profit: (+tIncome - +tGeneralExpense - +tCarExpense)
    }
}


export const getCarReportCsv = async (vehicleId: string) => {
    const paymentReportCsv = await Payment.aggregate([
        {
            $match: {
                vehicle: new mongoose.Types.ObjectId(vehicleId),
            }
        },
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
            $group: {
                _id: {
                    customer: "$customer.name"
                },
                paid: {
                    $sum: "$paid"
                }
            }
        },
        {
            $project: {
                _id: 0,
                customer: "$_id.customer",
                paid: 1,
            }
        }
    ]);

    return paymentReportCsv.map(payment => {
        let obj = {
            customer: payment.customer,
            paid: payment.paid,
        }
        return Object.values(obj)
    });
}

export const getExpenseReportCsv = async (vehicleId: string) => {
    let expenseReport = await Expense.aggregate([
        {
            $match: {
                vehicle: new mongoose.Types.ObjectId(vehicleId),
                expenseType: 'CAR_EXPENSE',
            }
        },
        {
            $unwind: '$allExpense'
        },
        {
            $group: {
                _id: null,
                expenses: {
                    $push: "$allExpense"
                }
            }
        }
    ])

    let expenseReportMap = [];
    if (expenseReport.length === 1) {
        expenseReportMap = expenseReport[0].expenses.map((expense: {description: string, amount: number}) => {
            let obj = {
                description: expense.description,
                amount: expense.amount,
            }
            return Object.values(obj)
        })
    }
    return expenseReportMap
}


export const getGeneralExpenseCsv = async () => {
    const generalExpenseReport = await Expense.aggregate([
        {
            $match: {
                expenseType: 'GENERAL_EXPENSE',
            }
        },
        {
            $unwind: '$allExpense'
        },
        {
            $group: {
                _id: null,
                expenses: {
                    $push: "$allExpense"
                }
            }
        }
    ])

    let generalExpenseReportMap = [];
    if (generalExpenseReport.length === 1) {
        generalExpenseReportMap = generalExpenseReport[0].expenses.map((expense: {description: string, amount: number}) => {
            let obj = {
                description: expense.description,
                amount: expense.amount,
            }
            return Object.values(obj)
        })
    }

    return generalExpenseReportMap
}

