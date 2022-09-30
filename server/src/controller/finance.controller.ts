import {IController} from "../interface";
import {NextFunction, Request, Response, Router} from "express";
import {
    getCarReportCsv,
    getExpenseReport,
    getExpenseReportCsv, getGeneralExpenseCsv,
    getGeneralReport,
    getIncomeReport
} from "../services/finance.service";

class FinanceController implements IController {
    path = '/finance';
    router = Router();
    constructor() {
        this.router.get(`${this.path}/general-report-csv`, this.getGeneralExpenseCsv)
        this.router.get(`${this.path}/expense-report-csv/:vehicleId`, this.getExpenseReportCsv)
        this.router.get(`${this.path}/income-report-csv/:vehicleId`, this.getCarReportCsv)
        this.router.get(`${this.path}/:vehicleId`, this.getCarReport)
        this.router.get(`${this.path}-general`, this.getGeneralReport)
    }

    private getGeneralExpenseCsv = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const generalExpenseCsv = await getGeneralExpenseCsv();
            res.status(200).json(generalExpenseCsv);
        } catch (e) {
            next(e);
        }
    }

    private getExpenseReportCsv = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { vehicleId } = req.params;
            const paymentReportCsv = await getExpenseReportCsv(vehicleId);
            res.status(200).json(paymentReportCsv);
        } catch (e) {
            next(e);
        }
    }

    private getCarReportCsv = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { vehicleId } = req.params;
            const paymentReportCsv = await getCarReportCsv(vehicleId);
            res.status(200).json(paymentReportCsv);
        } catch (e) {
            next(e);
        }
    }

    private getCarReport = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate, reportType } = req.query;
            const { vehicleId } = req.params;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);

            switch (reportType) {

                case 'OVERALL':
                    const { paymentReportMap: overAllPayment, tIncome: overAllTIncome, incomeCount: overallIncomeCount} =
                        await getIncomeReport(vehicleId, startDate.toString(), endDate.toString(), size, pageNo);

                    const { expenseReportMap: overAllExpense, tExpense: overAllTExpense, expenseCount: overAllExpenseCount } =
                        await getExpenseReport(vehicleId, startDate.toString(), endDate.toString(), size, pageNo);

                    res.status(200).json({
                        totalIncome: overAllTIncome,
                        paymentReport: overAllPayment,
                        incomeCount: overallIncomeCount,
                        totalExpense: overAllTExpense,
                        expenseReport: overAllExpense,
                        expenseCount: overAllExpenseCount,
                        fetched: true
                    })
                    break;

                case 'INCOME':
                    const { paymentReportMap, tIncome, incomeCount} =
                        await getIncomeReport(vehicleId, startDate.toString(), endDate.toString(), size, pageNo);

                    res.status(200).json({
                        totalIncome: tIncome,
                        paymentReport: paymentReportMap,
                        incomeCount,
                        fetched: true
                    })
                    break;

                case 'EXPENSE':
                    const { expenseReportMap, tExpense, expenseCount } =
                    await getExpenseReport(vehicleId, startDate.toString(), endDate.toString(), size, pageNo);

                    res.status(200).json({
                        totalExpense: tExpense,
                        expenseReport: expenseReportMap,
                        expenseCount,
                        fetched: true
                    })
                    break;
            }

        } catch (e) {
            console.log(e);
            next(e);
        }
    }


    private getGeneralReport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { startDate, endDate } = req.query;
            const pageNo = parseInt(<string>req.query.page);
            const size = parseInt(<string>req.query.size);
            const {totalGeneralExpense, totalCarExpense, totalIncome, profit, generalExpenseReport, generalExpenseCount} =
                await getGeneralReport(startDate.toString(), endDate.toString(), size, pageNo);

            res.status(200).json({
                generalExpenseReport,
                generalExpenseCount,
                totalGeneralExpense,
                totalCarExpense,
                totalIncome,
                profit,
                fetched: true,
            })
        } catch (e) {
            next(e);
        }
    }

}

export default FinanceController;
