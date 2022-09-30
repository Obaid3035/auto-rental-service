import React, {useState} from 'react';
import {
    useFetchRentalByCustomerQuery,
    useFetchInActiveRentalByCustomerQuery,
    useFetchCustomerAndItsRentalCountQuery,
    useFetchRentalByIdQuery
} from "../../../redux/apiSlice";
import * as GiIcons from "react-icons/gi";
import {Tab, Table, Tabs} from "react-bootstrap";
import { useParams } from "react-router-dom";
import MuiDataTable from "../../../component/MuiDataTable/MuiDataTable";
import OverLaySpinner from "../../../lib/Spinner/Spinner";
import './CustomerDetail.css';
import DisplayError from "../../../component/DisplayError/DisplayError";
import * as AiIcons from "react-icons/ai";
import * as MdIcons from "react-icons/md";
import StyledModal from "../../../component/StyledModal/StyledModal";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";


const CustomerDetail = () => {

    const navigation = useNavigate();

    const [key, setKey] = useState<string>('active');


    const [show, setShow] = useState<boolean>(false)

    const [skip, setSkip] = useState<boolean>(true)

    const [paramId, setParamId] = useState<string| null>(null)
    const { data: rental = {}, isFetching: rentalIsFetching} = useFetchRentalByIdQuery(paramId, {
        skip
    })

    const onModalOpenHandler = (props: string) => {
        setShow(!show)
        setParamId(props)
        setSkip((prev) => !prev)
    }



    const { id } = useParams();

    const { data = {customer: {}, count: 0, totalBalance: 0 }, isFetching,  isError, error} = useFetchCustomerAndItsRentalCountQuery({ params: id });

    const columns = [
        {
            name: "ID",
            options: {
                display: false,
            }
        },
        "ISSUE DATE",
        "Reg No.",
        "TARIFF",
        "ADVANCE AMOUNT",
        "BALANCE",
        {
            name: "View Rental",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action view_action'} onClick={() => onModalOpenHandler(tableMeta.rowData[0])}>
                            <AiIcons.AiFillEye />
                        </button>
                    )
                }
            }
        },
        {
            name: "View Payments",
            options: {
                customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
                    return (
                        <button className={'action red_action'} onClick={() => navigation('/rental-detail/' + tableMeta.rowData[0])}>
                            <MdIcons.MdPayments />
                        </button>
                    )
                }
            }
        },

    ];




    const customerColumns = [
        "Name",
        "CNIC#",
        "RESIDENTIAL ADDRESS",
        "Phone#",
        "TOTAL RENTALS"
    ];

    let customer = <OverLaySpinner isActive={isFetching} />

    if (data && !isFetching) {
        customer = (
            <tr>
                <td>{ data.customer.name} </td>
                <td>{ data.customer.cnic}</td>
                <td>{ data.customer.residentialAddress}</td>
                <td>{ data.customer.phone}</td>
                <td>{data.count}</td>
            </tr>
        )
    }

    if (isError) {
        return <DisplayError error={error}/>
    }

    const modal = <StyledModal show={show} setShow={setShow} isFetching={rentalIsFetching} data={rental} setSkip={setSkip}/>



    return (
        <div className={'page_responsive'}>
            { modal }
            <div className={'header'}>
                <h5>Customer Detail</h5>
                <div className={'d-flex align-items-center total_earning mb-4 justify-content-between'}>
                    <GiIcons.GiCash/>
                    <div>
                        <p className={'p-0 m-0'}>Total Balance</p>
                        <h5 className={'p-0 m-0'}>RS {!isFetching ? <CountUp end={data.totalBalance} duration={2}/> : 0}</h5>
                    </div>
                </div>
            </div>
            <div>
                <Table className={'customer_table'} responsive>
                    <thead>
                    <tr>
                        {
                            customerColumns.map(col => <th>{col}</th>)
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        customer
                    }
                    </tbody>
                </Table>
            </div>
            <div className={'mt-4'}>
                <Tabs
                    activeKey={key}
                    onSelect={(k) => {
                        if (k) {
                            setKey(k)
                        }
                    }}
                    className="mb-3 tabs"
                >
                    <Tab eventKey="active" title="Active" className={'w-100'}>
                        <MuiDataTable
                            tableName={'Rental'}
                            columns={columns}
                            api={useFetchRentalByCustomerQuery}
                            search={false}
                            download={false}
                            params={id}
                            csv={'customer-details'}
                        />
                    </Tab>
                    <Tab title={'Past'} eventKey="past" className={'w-100'}>
                        <MuiDataTable
                            tableName={'Rental'}
                            columns={columns}
                            download={false}
                            api={useFetchInActiveRentalByCustomerQuery}
                            search={false}
                            params={id}
                            csv={'customer-details'}
                        />
                    </Tab>
                </Tabs>

            </div>
        </div>
    );
};


export default CustomerDetail;
