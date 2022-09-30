import React from 'react';
import {NavLink} from "react-router-dom";
import MuiDataTable from "../../component/MuiDataTable/MuiDataTable";
import * as AiIcons from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useFetchCarInventoryQuery } from "../../redux/apiSlice";
import './CarInventory.css'

const CarInventory = () => {
    const navigation = useNavigate();

    const columns = [
        {
            name: "ID",
            options: {
                display: false,
            }
        },
        "Reg No",
        "Brand",
        "Model",
        "Year",
        "Tariff",
        "Status",
        {
            name: "Edit",
            options: {
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action edit_action'} onClick={() => navigation('/update-car-inventory/' + tableMeta.rowData[0])}>
                            <AiIcons.AiFillEdit />
                        </button>
                    )
                }
            }
        },
    ];


    return (
        <div className={'page_responsive'}>
            <div className={'header'}>
                <h5>Car Inventory</h5>
                <div>
                <NavLink to={'/create-car-inventory'}>
                    <button className={'px-4 py-2 mb-3'} >+ Add New Car Inventory</button>
                </NavLink>
                </div>
            </div>
            <div>
                {
                    <MuiDataTable
                        search={true}
                        download={true}
                        tableName={"Car Inventory"}
                        api={useFetchCarInventoryQuery}
                        columns={columns}
                        csv={'car-inventory'}
                    />
                }
            </div>
        </div>
    );
};

export default CarInventory;
