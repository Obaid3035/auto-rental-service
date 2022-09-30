import React from 'react';
import {NavLink} from "react-router-dom";
import {useFetchCustomersQuery} from "../../redux/apiSlice";
import * as AiIcons from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import MuiDataTable from "../../component/MuiDataTable/MuiDataTable";

const Customer = () => {
    const navigation = useNavigate();


    const columns = [
        {
            name: "ID",
            options: {
                display: false,
            }
        },
        "Name",
        "Cnic#",
        "Phone",
        {
            name: "Edit",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action edit_action'} onClick={() => navigation('/update-customer/' + tableMeta.rowData[0])}>
                            <AiIcons.AiFillEdit />
                        </button>
                    )
                }
            }
        },
        {
            name: "View",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action view_action'} onClick={() => navigation('/customer-rental/' + tableMeta.rowData[0])}>
                            <AiIcons.AiFillEye />
                        </button>
                    )
                }
            }
        },
    ];

    return (
        <div className={'page_responsive'}>
            <div className={'header'}>
                <h5>Customer</h5>
                <NavLink to={'/create-customer'}>
                    <button className={'px-2 py-2 mb-3'}>+ Create New Customer</button>
                </NavLink>
            </div>
            <div>
                <MuiDataTable
                    search={true}
                    download={true}
                    columns={columns}
                    tableName={'Customer'}
                    api={useFetchCustomersQuery}
                    csv={'customer'}
                />
            </div>
        </div>
    );


};

export default Customer;
