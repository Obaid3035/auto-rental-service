import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import * as BsIcons from "react-icons/bs";
import * as FaIcons from "react-icons/fa";

import Dashboard from "../../container/Dashboard/Dashboard";
import Rental from "../../container/Rental/Rental";
import CreateRental from "../../container/Rental/CreateRental/CreateRental";
import Customer from "../../container/Customer/Customer";
import CreateCustomer from "../../container/Customer/CreateCustomer/CreateCustomer";
import CarInventory from "../../container/CarInventory/CarInventory";
import CreateCarInventory from "../../container/CarInventory/CreateCarInventory/CreateCarInventory";
import CreateVehicle from "../../container/Vehicle/CreateVehicle/CreateVehicle";
import CreatePayment from "../../container/Rental/CreatePayment/CreatePayment";
import CarReport from "../../container/Finance/CarReport/CarReport";
import CustomerDetail from "../../container/Customer/CustomerDetail/CustomerDetail";
import UpdateCarInventory from "../../container/CarInventory/UpdateCarInventory/UpdateCarInventory";
import UpdateCustomer from "../../container/Customer/UpdateCustomer/UpdateCustomer";
import RentalDetail from "../../container/Rental/RentalDetail/RentalDetail";
import CloseRental from "../../container/Rental/CloseRental/CloseRental";
import EditRental from "../../container/Rental/EditRental/EditRental";
import Vehicle from "../../container/Vehicle/Vehicle/Vehicle";
import Expense from "../../container/Finance/CreateExpense/Expense";
import GeneralReport from "../../container/Finance/GeneralReport/GeneralReport";

export interface RoutesLink {
    component: JSX.Element,
    path: string,
}

export interface SideBarRoutes {
    icon: JSX.Element,
    path?: string,
    title: string,
    isSubNav?: boolean,
    subNav?: {
        path: string,
        title: string
    }[]
}



export const routes: RoutesLink[] = [
    {
        path: '/',
        component: <Dashboard />,
    },
    {
        path: '/rentals',
        component: <Rental />,
    },
    {
        path: '/customers',
        component: <Customer />,
    },
    {
        path: '/car-inventory',
        component: <CarInventory />,
    },
    {
        path: '/vehicle',
        component: <Vehicle />
    },
    {
        path: '/rental-detail/:id',
        component: <RentalDetail />
    },
    {
        path: '/create-rental',
        component: <CreateRental />,
    },
    {
        path: '/close-rental/:id',
        component: <CloseRental />
    },
    {
        path: '/create-payment/:id',
        component: <CreatePayment />
    },
    {
        path: '/create-customer',
        component: <CreateCustomer />,
    },
    {
        path: '/update-customer/:id',
        component: <UpdateCustomer />,
    },

    {
        path: '/create-car-inventory',
        component: <CreateCarInventory />
    },
    {
        path: '/update-car-inventory/:id',
        component: <UpdateCarInventory />
    },
    {
        path: '/create-vehicle',
        component: <CreateVehicle />
    },
    {
        path: '/customer-rental/:id',
        component: <CustomerDetail />
    },
    {
        path: '/edit-rental/:id',
        component: <EditRental />
    },
    {
        path: '/expense',
        component: <Expense />
    },
    {
        path: '/car-report',
        component: <CarReport />
    },
    {
        path: '/general-report',
        component: <GeneralReport />
    }
]

export const sideBarItems: SideBarRoutes[] = [
    {
        path: '/',
        icon: <AiIcons.AiFillDashboard/>,
        title: 'Dashboard',
        isSubNav: false,
    },
    {
        path: '/rentals',
        icon: <MdIcons.MdCarRental/>,
        title: 'Rentals',
        isSubNav: false,
    },
    {
        path: '/customers',
        icon: <BsIcons.BsFillPeopleFill/>,
        title: 'Customers',
        isSubNav: false,
    },
    {
        path: '/car-inventory',
        icon: <MdIcons.MdInventory2 />,
        title: 'Car Inventory',
        isSubNav: false,
    },

    {
        path: '/vehicle',
        title: 'Vehicle',
        icon: <MdIcons.MdBrandingWatermark />,
        isSubNav: false,
    },

    {
        title: 'Finance',
        icon: <FaIcons.FaMoneyBillAlt />,
        isSubNav: true,
        subNav: [
            {
                path: '/car-report',
                title: 'Car Report'
            },
            {
                path: '/general-report',
                title: 'General Report'
            }
        ]
    },
]



