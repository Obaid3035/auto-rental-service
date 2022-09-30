import express, {Application} from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import handleError from "./middleware/handleError";
import {IController} from "./interface";

class App {
    public app: Application;

    constructor(controllers: IController[]) {
        this.app = express();
        this.initializeMiddleware();
        this.initializeController(controllers);
        this.initializeErrorHandler();
    }
    public listenAndInitializeDatabase () {
        const uri: string = "mongodb+srv://scrub:scrub123@cluster0.qdokjlh.mongodb.net/scrub?authSource=admin&replicaSet=atlas-bep0lt-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";
        mongoose.connect(uri, (err) => {
            if (!err) {
                this.app.listen(process.env.PORT, () => {
                    console.log('Server is listening on port 4000');
                })
            }
        })
    }
    private initializeMiddleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}))
    }

    private initializeController(controllers: IController[]) {
        controllers.forEach(controller => {
            this.app.use(controller.router)
        })
    }

    private initializeErrorHandler() {
        this.app.use(handleError);
    }
}

export default App;
