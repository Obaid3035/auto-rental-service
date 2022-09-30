import React, {useEffect, useState} from 'react';
import * as AiIcons from 'react-icons/ai'
import * as MdIcons from 'react-icons/md'
import MuiDataTable from "../../component/MuiDataTable/MuiDataTable";
import {
    useFetchActiveDailyRentalQuery,
    useFetchActiveMonthlyRentalQuery,
    useFetchInActiveDailyRentalQuery,
    useFetchInActiveMonthlyRentalQuery,
    useRentalDailyIncrementalMutation,
    useFetchRentalByIdQuery,
    useRentalMonthlyIncrementalMutation,
    useDeleteRentalByIdMutation
} from "../../redux/apiSlice";
import { useNavigate } from "react-router-dom";
import './Rental.css';
import {NavLink} from "react-router-dom";
import {Button, Modal, Tab, Tabs} from "react-bootstrap";
import StyledModal from "../../component/StyledModal/StyledModal";
import {successNotify} from "../../utils/toast";
import OverLaySpinner from "../../lib/Spinner/Spinner";
import DisplayError from "../../component/DisplayError/DisplayError";

const Rental = () => {
    const navigation = useNavigate();


    const [rentalType, setRentalType] = useState<string>('Active');
    const [chargeType, setChargeType] = useState<string>('Daily')
    const [addDailyIncremental, {isLoading, error, isError, isSuccess}] = useRentalDailyIncrementalMutation();
    const [addMonthlyIncremental, {isLoading: isMonthlyLoading, error: monthlyError, isError: isMonthlyError, isSuccess: isMonthlySuccess}] = useRentalMonthlyIncrementalMutation()
    const [deleteRental, {isLoading: isDeleting, error: deleteError, isError: isDeleteError, isSuccess: isDeleteSuccess}] = useDeleteRentalByIdMutation();

    useEffect(() => {
        if (isSuccess) {
            successNotify('Rental Successfully Incremented!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess])

    useEffect(() => {
        if (isMonthlySuccess) {
            successNotify('Rental Successfully Incremented!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMonthlySuccess])

    useEffect(() => {
        if (isDeleteSuccess) {
            successNotify('Rental Successfully Deleted!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDeleteSuccess])

    const [show, setShow] = useState<boolean>(false)
    const [deleteShow, setDeleteShow] = useState<boolean>(false)

    const [skip, setSkip] = useState<boolean>(true)

    const [paramId, setParamId] = useState<string| null>(null)
    const { data = {}, isFetching} = useFetchRentalByIdQuery(paramId, {
        skip
    })



    const onModalOpenHandler = (props: string) => {
        setShow(!show)
        setParamId(props)
        setSkip(false)
    }

    const onDeleteModalHandler = (props: string) => {
        setDeleteShow(!show)
        setParamId(props)
    }



    const columns = [
        {
            name: "ID",
            options: {
                display: false,
            }
        },
        "Issue Date",
        "Customer Name",
        "Reg No.",
        "Tariff",
        "Advance Amount",
        "Balance",
        "Next Incremental",
        {
            name: "Close Rental",
            options: {
                display: rentalType === 'Active',
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action close_action'} onClick={() => navigation('/close-rental/' + tableMeta.rowData[0])}>
                            <AiIcons.AiOutlineIssuesClose />
                        </button>
                    )
                }
            }
        },
        {
            name: "Edit Rental",
            options: {
                display: rentalType === 'Active',
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action edit_action'} onClick={() => navigation('/edit-rental/' + tableMeta.rowData[0])}>
                            <AiIcons.AiFillEdit />
                        </button>
                    )
                }
            }
        },
        {
            name: "Create Payments",
            options: {
                display: rentalType === 'Active',
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action payment_action'} onClick={() => navigation('/create-payment/' + tableMeta.rowData[0])}>
                            <MdIcons.MdPayment />
                        </button>
                    )
                }
            }
        },
        {
            name: "View Payments",
            options: {
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action red_action'} onClick={() => navigation('/rental-detail/' + tableMeta.rowData[0])}>
                            <MdIcons.MdPayments />
                        </button>
                    )
                }
            }
        },
        {
            name: "View Rental",
            options: {
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action view_action'} onClick={() => onModalOpenHandler(tableMeta.rowData[0])}>
                            <AiIcons.AiFillEye />
                        </button>
                    )
                }
            }
        },
        {
            name: "Delete Rental",
            options: {
                customBodyRender: (value: any, tableMeta: any) => {
                    return (
                        <button className={'action red_action'} onClick={() => onDeleteModalHandler(tableMeta.rowData[0])}>
                            <AiIcons.AiFillDelete />
                        </button>
                    )
                }
            }
        }
        ];


    const modal = <StyledModal show={show} setShow={setShow} isFetching={isFetching} data={data} setSkip={setSkip}/>

    const onDeleteRentalHandler = async () => {
        setDeleteShow(!deleteShow)
        await deleteRental(paramId)
    }

    const deleteModal = (
        <Modal show={deleteShow} className={'delete_modal'} centered={true}>
            <p>Do you really want to delete</p>
            <div className={'d-flex justify-content-center'}>
                <Button className={'mr-3 delete_yes'} onClick={onDeleteRentalHandler}>Yes</Button>
                <Button onClick={() => setDeleteShow(!deleteShow)}className={'ml-3'}>No</Button>
            </div>
        </Modal>
    )

    const onDailyIncrementalHandler = async () => {
        await addDailyIncremental(null)
    }

    const onMonthlyIncrementalHandler = async () => {
        await addMonthlyIncremental(null)
    }

    let allRentals = <OverLaySpinner isActive={isLoading || isDeleting || isMonthlyLoading}/>
    if (!(isLoading || isDeleting || isMonthlyLoading)) {
        allRentals = (
            <div className={'page_responsive'}>
                { modal }
                { deleteModal }
                <div className={'header'}>
                    <h5>Rentals</h5>
                    <div>
                        <NavLink to={'/create-rental'}>
                            <button className={'px-2 py-2'}>+ Create New Rental</button>
                        </NavLink>
                        <button onClick={onDailyIncrementalHandler} className={'px-2 mx-4 py-2'}>Daily Increment +</button>
                        <button onClick={onMonthlyIncrementalHandler} className={'px-2 mx-4 py-2'}>Monthly Increment +</button>
                    </div>
                </div>
                <Tabs
                    activeKey={rentalType}
                    onSelect={(k) => {
                        if (k) {
                            setRentalType(k)
                        }
                    }}
                    className="mb-3 tabs"
                >
                    <Tab eventKey="Active" title="Active" className={'w-100'}>
                        <Tabs  activeKey={chargeType}
                               onSelect={(k) => {
                                   if (k) {
                                       setChargeType(k)
                                   }
                               }}
                               className="mb-3 tabs">
                            <Tab eventKey={'Daily'} title={"Daily"} className={'w-100'}>
                                <MuiDataTable
                                    search={true}
                                    download={true}
                                    tableName={'Rental'}
                                    columns={columns}
                                    api={useFetchActiveDailyRentalQuery}
                                    csv={'active-rental-daily'}
                                />
                            </Tab>
                            <Tab eventKey={'Monthly'} title={"Monthly"} className={'w-100'}>
                                <MuiDataTable
                                    search={true}
                                    download={true}
                                    tableName={'Rental'}
                                    columns={columns}
                                    api={useFetchActiveMonthlyRentalQuery}
                                    csv={'active-rental-monthly'}
                                />
                            </Tab>
                        </Tabs>
                    </Tab>

                    <Tab title={'Past'} eventKey="past" className={'w-100'}>
                        <Tabs  activeKey={chargeType}
                               onSelect={(k) => {
                                   if (k) {
                                       setChargeType(k)
                                   }
                               }}
                               className="mb-3 tabs">
                            <Tab eventKey={'Daily'} title={"Daily"} className={'w-100'}>
                                <MuiDataTable
                                    search={true}
                                    download={true}
                                    tableName={'Rental'}
                                    columns={columns}
                                    api={useFetchInActiveDailyRentalQuery}
                                    csv={'inactive-rental-daily'}
                                />
                            </Tab>
                            <Tab eventKey={'Monthly'} title={"Monthly"} className={'w-100'}>
                                <MuiDataTable
                                    search={true}
                                    download={true}
                                    tableName={'Rental'}
                                    columns={columns}
                                    api={useFetchInActiveMonthlyRentalQuery}
                                    csv={'inactive-rental-monthly'}
                                />
                            </Tab>
                        </Tabs>
                    </Tab>

                </Tabs>
            </div>
        )
    }

    if (isError) {
        return <DisplayError error={error} />
    }

    if (isDeleteError) {
        return <DisplayError error={deleteError} />
    }

    if (isMonthlyError) {
        return <DisplayError error={monthlyError}/>
    }

    return allRentals
};


export default Rental;
