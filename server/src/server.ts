import App from "./app";
import CustomerController from "./controller/customer.controller";
import VehicleController from "./controller/vehicle.controller";
import CarInventoryController from "./controller/carInventory.controller";
import RentalController from "./controller/rental.controller";
import PaymentController from "./controller/payment.controller";
import ExpenseController from "./controller/expense.controller";
import FinanceController from "./controller/finance.controller";
import UserController from "./controller/user.controller";
import DashboardController from "./controller/dashboard.controller";

const app = new App([
    new UserController(),
    new CustomerController(),
    new VehicleController(),
    new CarInventoryController(),
    new RentalController(),
    new PaymentController(),
    new ExpenseController(),
    new FinanceController(),
    new DashboardController()
]);


app.listenAndInitializeDatabase();

