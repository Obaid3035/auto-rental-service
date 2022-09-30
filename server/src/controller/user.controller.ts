import {Response, NextFunction, Request, Router} from "express";
import {IController, IUser} from "../interface";
import User from "../model/user";
import auth from "../middleware/auth";


class UserController implements IController {
    path =  '/auth';
    router =  Router()

    constructor() {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router
            .get(`${this.path}/current-user`, auth, this.getCurrentUser)
            .post(`${this.path}/register`, this.register)
            .post(`${this.path}/login`, this.login)
    }

    private register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;
            await User.userExist(req.body);
            const user: IUser = await User.create({
                name,
                email,
                password
            });

            const token: string = await user.generateToken();
            res.status(200).json({ saved: true, token })
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    private login =  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.authenticate(req.body);
            const token = await user.generateToken();
            res.status(200).json({
                auth: true,
                token
            });
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    private getCurrentUser =  async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUser = (req as any).user;
            res.status(200).json({
                currentUser,
                auth: true
            });
        } catch (e) {
            next(e);
        }
    }


}

export default UserController;
