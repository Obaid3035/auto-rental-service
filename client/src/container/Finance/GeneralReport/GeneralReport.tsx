import React, {useState} from 'react';
import {NavLink} from "react-router-dom";
import {Form} from "react-bootstrap";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import {TextField} from "@mui/material";
import * as GiIcons from "react-icons/gi";
import CountUp from "react-countup";
import axios from "axios";
import "./GeneralReport.css";
import {errorNotify} from "../../../utils/toast";
import OverLaySpinner from "../../../lib/Spinner/Spinner";
import {ThemeProvider} from "@material-ui/core/styles";
import {getMuiTheme} from "../../../component/MuiDataTable/MuiDataTable";
import MUIDataTable, {FilterType} from "mui-datatables";
import download from "downloadjs";

const GeneralReport = () => {

    const [state] = useState({
        page: 0,
        rowsPerPage: 10,
        searchText: '',
    });

    const [data, setDate] = React.useState(
        {
            generalExpenseReport: [],
            generalExpenseCount: 0,
            totalGeneralExpense: 0,
            totalCarExpense: 0,
            fetched: false,
            totalIncome: 0,
            profit: 0
        });

    const [startDate, setStartDate] = React.useState<Date | null>(
        new Date(),
    );

    const [endDate, setEndDate] = React.useState<Date | null>(
        new Date(),
    );

    const [isLoading, setIsLoading] = React.useState(false)

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
        setDate({
            generalExpenseReport: [],
            generalExpenseCount: 0,
            totalGeneralExpense: 0,
            totalCarExpense: 0,
            fetched: false,
            totalIncome: 0,
            profit: 0
        })
        setIsLoading(true)
        axios.get(`/finance-general?startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}&page=0&size=${state.rowsPerPage}`)
            .then((res) => {
                setDate({
                    ...res.data
                })
                setIsLoading(false)
            }).catch(() => {
            setIsLoading(false);
            errorNotify('Something went wrong')
        })
    }

    let result = null;

    if (isLoading) {
        result = <OverLaySpinner isActive={isLoading} />
    }

    const changePage = (newTableState: any) => {
        setDate({
            generalExpenseReport: [],
            generalExpenseCount: 0,
            totalGeneralExpense: 0,
            totalCarExpense: 0,
            fetched: false,
            totalIncome: 0,
            profit: 0
        })
        setIsLoading(true)
        axios.get(`/finance-general?startDate=${startDate?.toISOString()}&endDate=${endDate?.toISOString()}&page=${newTableState.page}&size=${state.rowsPerPage}`)
            .then((res) => {
                setDate(res.data)
                setIsLoading(false)
            }).catch(() => {
            setIsLoading(false);
            errorNotify('Something went wrong')
        })
    }

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
        onDownload: () => {
            axios.get('finance/general-report-csv')
                .then((res) => {
                    let csv = expenseColumn.toString().concat("\n")
                    const body = res.data;
                    body.forEach(function(row: any) {
                        csv += row.join(',');
                        csv += "\n";
                    });
                    download(csv, 'general-report.csv', "text/csv")
                })
            return false;
        },
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

    if (data.fetched) {
        result = (
            <div>
                <div className=" report_stats mt-5 animate__animated animate__fadeInDown">
                    <div className={'stats d-flex align-items-center p-4 mr-3 total_earning justify-content-around'}>
                        <GiIcons.GiCash/>
                        <div>
                            <p className={'p-0 m-0'}>Car Income</p>
                            <h5 className={'p-0 m-0'}>RS <CountUp end={data.totalIncome} duration={2}/></h5>
                        </div>
                    </div>
                    <div className={'stats d-flex align-items-center p-4 mr-3 total_earning justify-content-around'}>
                        <GiIcons.GiCash/>
                        <div>
                            <p className={'p-0 m-0'}>General Expense</p>
                            <h5 className={'p-0 m-0'}>RS <CountUp end={data.totalGeneralExpense} duration={2}/></h5>
                        </div>
                    </div>
                    <div className={'stats d-flex align-items-center p-4 mr-3 total_earning justify-content-around'}>
                        <GiIcons.GiCash/>
                        <div>
                            <p className={'p-0 m-0'}>Car Expense</p>
                            <h5 className={'p-0 m-0'}>RS <CountUp end={data.totalCarExpense} duration={2}/></h5>
                        </div>
                    </div>
                    <div className={'stats d-flex align-items-center p-4 mr-3 total_earning justify-content-around'}>
                        <GiIcons.GiCash/>
                        <div>
                            <p className={'p-0 m-0'}>Profit</p>
                            <h5 className={'p-0 m-0'}>RS <CountUp end={data.profit} duration={2}/></h5>
                        </div>
                    </div>
                </div>
                <div className={'mt-5 pb-5'}>
                    <ThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title={`General Expense List`}
                            data={data.generalExpenseReport}
                            columns={expenseColumn}
                            options={{...options, count: data.generalExpenseCount}}
                        />
                    </ThemeProvider>
                </div>
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
                        <Form.Group className={'col-md-6'}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={startDateHandler}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Form.Group>
                        <Form.Group className={'col-md-6'}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
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
};

export default GeneralReport;
