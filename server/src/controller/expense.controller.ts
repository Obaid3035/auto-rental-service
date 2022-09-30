import {IController} from "../interface";
import {NextFunction, Request, Response, Router} from "express";
import Expense from "../model/expense";

class ExpenseController implements IController {
    path =  '/expense';
    router = Router();

    constructor() {
        this.router.post(`${this.path}`, this.create)
    }

    private create = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            await Expense.create(req.body)
            res.status(200).json({ saved: true });
        } catch (e) {
            next(e);
        }
    }
}

export default ExpenseController;
