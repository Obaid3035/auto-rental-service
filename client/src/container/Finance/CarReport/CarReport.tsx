import React, {useEffect, useState} from 'react';
import * as GiIcons from "react-icons/gi";
import {Form} from "react-bootstrap";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from '@mui/lab/DatePicker';
import {TextField} from "@mui/material";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import axios from "axios";
import {SelectOptions} from "../../Rental/CreateRental/CreateRental";
import {NavLink} from "react-router-dom";
import CountUp from "react-countup";
import MUIDataTable, {FilterType} from "mui-datatables";
import {ThemeProvider} from "@material-ui/core/styles";
import {getMuiTheme} from "../../../component/MuiDataTable/MuiDataTable";
import OverLaySpinner from "../../../lib/Spinner/Spinner";
import {errorNotify} from "../../../utils/toast";
import './CarReport.css';
import Select from "react-select";
import download from "downloadjs";

const CarReport = () => {

    const [vehicleOption, setVehicleOption] = useState([]);

    useEffect(() => {
        axios.get('/car-inventory-all-options')
            .then((res) => {
                setVehicleOption(res.data)
            })

    }, [])

    const [state] = useState({
        page: 0,
        rowsPerPage: 10,
        searchText: '',
    });

    const [startDate, setStartDate] = React.useState<Date | null>(
        new Date(),
    );

    const [endDate, setEndDate] = React.useState<Date | null>(
        new Date(),
    );
    const [selectedType, setSelectedType] = useState<SelectOptions | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<SelectOptions | null>(null);
    const [data, setDate] = React.useState(
        {
            paymentReport: [],
            expenseReport: [],
            totalIncome: 0,
            totalExpense: 0,
            fetched: false,
            expenseCount: 0,
            incomeCount: 0
        });

    const [isLoading, setIsLoading] = React.useState(false)

    const typeOptions = [
        {
            label: 'Overall',
            value: 'OVERALL'
        },
        {
            label: 'Income',
            value: 'INCOME'
        },
        {
            label: 'Expense',
            value: 'EXPENSE'
        }
    ]

    const startDateHandler = (date: Date | null) => {
        if (date) {
            setStartDate(date)
        }
    };

    const endDateHandler = (date: Date | null) => {
        if (date) {
            setEndDate(date)
        }
    };

    const onSubmitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedType && selectedVehicle) {
            setDate({
                paymentReport: [],
                expenseReport: [],
                totalIncome: 0,
                totalExpense: 0,
                fetched: false,
                expenseCount: 0,
                incomeCount: 0
            })
            setIsLoading(true)
            axios.get(`/finance/${selectedVehicle?.value}?startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}&reportType=${selectedType?.value}&page=0&size=${state.rowsPerPage}`)
                .then((res) => {
                    setDate(res.data)
                    setIsLoading(false)
                }).catch(() => {
                setIsLoading(false);
                errorNotify('Something went wrong')
            })
        } else {
            errorNotify('Please Select Missing Fields!');
        }

    }

    const changePage = (newTableState: any) => {
        setDate({
            paymentReport: [],
            expenseReport: [],
            totalIncome: 0,
            totalExpense: 0,
            fetched: false,
            expenseCount: 0,
            incomeCount: 0
        })
        setIsLoading(true)
        axios.get(`/finance/${selectedVehicle?.value}?startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}&reportType=${selectedType?.value}&page=${newTableState.page}&size=${state.rowsPerPage}`)
            .then((res) => {
                setDate(res.data)
                setIsLoading(false)
            }).catch(() => {
            setIsLoading(false);
            errorNotify('Something went wrong')
        })
    }

    const incomeColumns = [
        "Customer Name",
        "Total Paid"
    ]

    const expenseColumn = [
        'Description',
        'Amount'
    ]

    const options: FilterType | any = {
        filter: false,
        search: false,
        rowsPerPage: state.rowsPerPage,
        rowsPerPageOptions: [],
        searchText: state.searchText,
        serverSide: true,
        jumpToPage: false,
        print: false,
        viewColumns: false,
        responsive: 'standard',
        page: state.page,
        filterType: "dropdown",
        selectableRows: 'none',
        onTableChange: (action: string, newTableState: any) => {
            switch (action) {
                case 'changePage':
                    changePage(newTableState);
                    break;
                case 'search':
                    changePage(newTableState);
                    break;
            }
        },
        textLabels: {
            body: {
                noMatch: isLoading ?
                    (
                        <OverLaySpinner isActive={isLoading}/>
                    ) : 'No Data Found'
            }
        },
    }

    let result = null;

    if (isLoading) {
        result = <OverLaySpinner isActive={isLoading} />
    }

    let getStatsData = () => {
        if (selectedType?.value === 'INCOME') {
            return (
                <div className={'stats d-flex align-items-center p-4 total_earning justify-content-around'}>
                    <GiIcons.GiCash/>
                    <div>
                        <p className={'p-0 m-0'}>Total Income</p>
                        <h5 className={'p-0 m-0'}>RS <CountUp end={data.totalIncome} duration={2}/></h5>
                    </div>
                </div>
            )
        }
        if (selectedType?.value === 'EXPENSE') {
            return (
                <div className={'stats d-flex align-items-center p-4 total_earning justify-content-around'}>
                    <GiIcons.GiCash/>
                    <div>
                        <p className={'p-0 m-0'}>Total Expense</p>
                        <h5 className={'p-0 m-0'}>RS <CountUp end={data.totalExpense} duration={2}/></h5>
                    </div>
                </div>
            )
        }

        if (selectedType?.value === 'OVERALL') {
            return (
                <React.Fragment>
                    <div className={'stats d-flex align-items-center p-4 total_earning justify-content-around'}>
                        <GiIcons.GiCash/>
                        <div>
                            <p className={'p-0 m-0'}>Total Income</p>
                            <h5 className={'p-0 m-0'}>RS <CountUp end={data.totalIncome} duration={2}/></h5>
                        </div>
                    </div>
                    <div className={'stats d-flex align-items-center p-4 total_earning justify-content-around'}>
                        <GiIcons.GiCash/>
                        <div>
                            <p className={'p-0 m-0'}>Total Expense</p>
                            <h5 className={'p-0 m-0'}>RS <CountUp end={data.totalExpense} duration={2}/></h5>
                        </div>
                    </div>
                    <div className={'stats d-flex align-items-center p-4 total_earning justify-content-around'}>
                        <GiIcons.GiCash/>
                        <div>
                            <p className={'p-0 m-0'}>Total Profit</p>
                            <h5 className={'p-0 m-0'}>RS <CountUp end={data.totalIncome - data.totalExpense}
                                                               duration={2}/></h5>
                        </div>
                    </div>
                </React.Fragment>
            )
        }
    }

    const incomeCsv = () => {
        axios.get(`finance/income-report-csv/${selectedVehicle?.value}`)
            .then((res) => {
                let csv = incomeColumns.toString().concat("\n")
                console.log(res.data)
                const body = res.data;
                body.forEach(function(row: any) {
                    csv += row.join(',');
                    csv += "\n";
                });
                download(csv, `incomeCsv.csv`, "text/csv")
            })
        return false;
    }

    const expenseCsv = () => {
        axios.get(`finance/expense-report-csv/${selectedVehicle?.value}`)
            .then((res) => {
                let csv = expenseColumn.filter((col: any) => {
                    return !col.name;
                }).toString().concat("\n")
                const body = res.data;
                body.forEach(function(row: any) {
                    csv += row.join(',');
                    csv += "\n";
                });
                download(csv, `expenseCsv.csv`, "text/csv")
            })
        return false;
    }


    let getDataTable = () => {

        if (selectedType?.value === 'OVERALL') {
            return (
                <React.Fragment>
                    <div className={'mt-5 pb-5'}>
                        <ThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title={`Income List`}
                                data={data.paymentReport}
                                columns={incomeColumns}
                                options={{...options, count: data.incomeCount, onDownload: incomeCsv }}
                            />
                        </ThemeProvider>
                    </div>
                    <div className={'mt-5 pb-5'}>
                        <ThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title={`Expense List`}
                                data={data.expenseReport}
                                columns={expenseColumn}
                                options={{ ...options, count: data.expenseCount, onDownload: expenseCsv }}
                            />
                        </ThemeProvider>
                    </div>
                </React.Fragment>
            )
        }

        if (selectedType?.value === 'INCOME') {
            return (
                <div className={'mt-5 pb-5'}>
                    <ThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title={`Income List`}
                            data={data.paymentReport}
                            columns={incomeColumns}
                            options={{...options, count: data.incomeCount, onDownload: incomeCsv}}
                        />
                    </ThemeProvider>
                </div>
            )
        }

        if (selectedType?.value === 'EXPENSE') {
            return (
                <div className={'mt-5 pb-5'}>
                    <ThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title={`Expense List`}
                            data={data.expenseReport}
                            columns={expenseColumn}
                            options={{ ...options, count: data.expenseCount , onDownload: expenseCsv}}
                        />
                    </ThemeProvider>
                </div>
            )
        }
    }

    if (data.fetched) {
        result = (
            <div>
                <div
                    className="d-flex report_stats w-100 justify-content-around mt-5 animate__animated animate__fadeInDown">
                    { getStatsData()}
                </div>

                { getDataTable() }
            </div>
        )
    }

    return (
        <div className={'page_responsive'}>
            <div className={'header'}>
                <h5>Finance</h5>
                <NavLink to={'/expense'}>
                    <button className="px-4 py-3 mb-3">Create Expense</button>
                </NavLink>
            </div>
            <div>
                <Form onSubmit={onSubmitHandler}>
                    <div className={'form-row create_form'}>
                        <Form.Group className={'col-md-12'} style={{
                            position: 'relative',
                            zIndex: 10
                        }}>
                            <Form.Label>
                                Report Type
                            </Form.Label>
                            <Select
                                placeholder={'Select Report Type'}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                value={selectedType}
                                options={typeOptions}
                                onChange={(value) => {
                                    setSelectedType(value)
                                    setDate({
                                        paymentReport: [],
                                        expenseReport: [],
                                        totalIncome: 0,
                                        totalExpense: 0,
                                        fetched: false,
                                        expenseCount: 0,
                                        incomeCount: 0
                                    })
                                }}

                            />
                        </Form.Group>
                        <Form.Group className={'col-md-12 z_index'}>
                            <Form.Label>
                                Choose Vehicle
                            </Form.Label>
                            <Select
                                placeholder={'Select Vehicle'}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                value={selectedVehicle}
                                options={vehicleOption}
                                onChange={(value) => {
                                    setSelectedVehicle(value)
                                }}
                            />
                        </Form.Group>
                        <Form.Group className={'col-md-6'}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date And Time"
                                    value={startDate}
                                    disabled={!selectedVehicle}
                                    onChange={startDateHandler}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Form.Group>
                        <Form.Group className={'col-md-6'}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date And Time"
                                    disabled={!selectedVehicle}
                                    value={endDate}
                                    onChange={endDateHandler}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Form.Group>
                        <div className="text-right w-100">
                            <button type={'submit'} className={'py-2 px-4'}>Generate</button>
                        </div>
                    </div>
                </Form>
            </div>
            { result }
        </div>
    );
}


export default CarReport;
