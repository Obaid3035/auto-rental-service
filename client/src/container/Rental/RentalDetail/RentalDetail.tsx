import React from 'react';
import * as GiIcons from "react-icons/gi";
import { useFetchPaymentQuery, useFetchPaymentSumQuery } from "../../../redux/apiSlice";
import { useParams } from "react-router-dom";
import MuiDataTable from "../../../component/MuiDataTable/MuiDataTable";
import DisplayError from "../../../component/DisplayError/DisplayError";
import CountUp from "react-countup";
const RentalDetail = () => {

    const { id } = useParams();

    const {data = [], isFetching, error, isError} = useFetchPaymentSumQuery({params: id});
    const columns = [
        {
            name: "ID",
            options: {
                display: false,
            }
        },
        "DATE & TIME",
        "Reg. No#",
        "Received By",
        "PAID",
        "DISCOUNT",
    ];

    if (isError) {
        return <DisplayError error={error}/>
    }

    return (
        <div className={'page_responsive'}>
            <div className={'header'}>
                <h5>All Payments</h5>
                <div className={'d-flex align-items-center total_earning mb-4 p-3 justify-content-between'}>
                    <GiIcons.GiCash />
                    <div>
                        <p className={'p-0 m-0'} style={{fontWeight: "bold"}} >BALANCE</p>
                        <h5 className={'p-0 m-0'}>RS {!isFetching ? (<CountUp end={data} duration={2}/>) : 0}</h5>
                    </div>
                </div>
            </div>
            <div className={'mt-4'}>
               <MuiDataTable
                   params={id}
                   tableName={'Payment'}
                   download={false}
                   columns={columns}
                   api={useFetchPaymentQuery}
                   search={false}
                   csv={'payment'}
               />
            </div>
        </div>
    );
};

export default RentalDetail;
