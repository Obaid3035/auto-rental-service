import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import Select from "react-select";
import DateTimePicker from '@mui/lab/DateTimePicker';
import {useCreateRentalMutation} from "../../../../redux/apiSlice";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {TextField} from "@mui/material";
import '../CreateRental.css';
import axios from "axios";
import DisplayError from "../../../../component/DisplayError/DisplayError";
import OverLaySpinner from "../../../../lib/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import { successNotify } from "../../../../utils/toast";
import { SelectOptions } from "../CreateRental";


const CreateNewRental = () => {
    const navigation = useNavigate();
    const [selectedCustomer, setSelectedCustomer] = useState<SelectOptions | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<SelectOptions | null>(null);
    const [customerOption, setCustomerOption] = useState([]);
    const [vehicleOption, setVehicleOption] = useState([]);
    const [ createRental , { isLoading, isError, error, isSuccess } ] = useCreateRentalMutation();

    if(isSuccess) {
        successNotify('Rental Created Successfully!')
        navigation('/rentals');
    }

    useEffect(() => {
        axios.get('/customer-options')
            .then((res) => {
                setCustomerOption(res.data)
            })

        axios.get('/car-inventory-options')
            .then((res) => {
                setVehicleOption(res.data)
            })

    }, [])

    const [formInput, setFormInput] = useState({
        SON: '',
        book: '',
        advanceAmount: 0,
        balance: 0,
        tariff: selectedVehicle?.tariff,
        rentalType: '',
        paymentType: '',
        rentalCharge: ''
    })

    const [issueDate, setIssueDate] = React.useState<Date | null>(
        new Date(),
    );

    const [returnDate, setReturnDate] = React.useState<Date | null>(
        new Date(),
    );

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormInput({
            ...formInput,
            [name]: value
        })
    }

    const issueDateHandler = (date: Date | null) => {
        if (date) {
            setIssueDate(date);
        }
    };

    const returnDateHandler = (date: Date | null) => {
        if (date) {
            setReturnDate(date);
        }
    };

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedVehicle && formInput.tariff) {
            const formData = {
                customer: selectedCustomer?.value,
                customerName: selectedCustomer?.label,
                vehicle: selectedVehicle?.value,
                vehicleNo: selectedVehicle?.label,
                issueDate,
                returnDate,
                SON: formInput.SON,
                book: formInput.book,
                advanceAmount: formInput.advanceAmount,
                balance: formInput.tariff - formInput.advanceAmount,
                tariff: formInput.tariff,
                rentalType: formInput.rentalType,
                rentalCharge: formInput.rentalCharge,
                paymentType: formInput.paymentType,
            }

            await createRental(formData)
        }

    }

    const getBalance = () => {
        if (formInput.tariff) {
            return formInput.tariff - formInput.advanceAmount
        } else {
            return 0
        }
    }

    const customerValidation = () => {
        return !(selectedVehicle && selectedCustomer);
    }


    let data = <OverLaySpinner isActive={isLoading}/>

    if (!isLoading) {
        data = (
            <Form onSubmit={onSubmitHandler}>
                <div className="form-row create_form">
                    <Form.Group className={'col-md-6 z_index'}>
                        <Form.Label>Choose Customer</Form.Label>
                        <Select
                            placeholder={'Select Model'}
                            className="basic-single"
                            classNamePrefix="select"
                            name="color"
                            value={selectedCustomer}
                            options={customerOption}
                            onChange={(value) => setSelectedCustomer(value)}
                        />
                    </Form.Group>
                    <Form.Group className={'col-md-6 z_index'}>
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
                                setFormInput({
                                    ...formInput,
                                    tariff: value?.tariff
                                })
                            }}
                        />
                    </Form.Group>
                    <Form.Group className="col-md-6">
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Issue Date And Time"
                                    value={issueDate}
                                    onChange={issueDateHandler}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </Form.Group>

                    <Form.Group className="col-md-6">
                        <div>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Return Date And Time"
                                    value={returnDate}
                                    onChange={returnDateHandler}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </Form.Group>
                    <Form.Group className="col-md-6">
                        <Form.Label>SON#</Form.Label>
                        <Form.Control className={'text_input'} required name={'SON'} onChange={onChangeHandler}  type={'text'} placeholder={'1234'} />
                    </Form.Group>
                    <Form.Group className="col-md-6">
                        <Form.Label>Book#</Form.Label>
                        <Form.Control className={'text_input'} required name={'book'} onChange={onChangeHandler}  type={'text'} placeholder={'1234'} />
                    </Form.Group>

                    <Form.Group className="col-md-4">
                        <Form.Label>Advance Amount</Form.Label>
                        <Form.Control className={'text_input'} required name={'advanceAmount'} onChange={onChangeHandler} min={0}  type={'number'} placeholder={'0/-'} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Tariff</Form.Label>
                        <Form.Control className={'text_input'} required name={'tariff'} value={formInput.tariff} onChange={onChangeHandler} min={0} type={'number'} placeholder={'0/-'} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Balance</Form.Label>
                        <Form.Control className={'text_input'} required name={'balance'} disabled value={getBalance()} type={'number'} placeholder={'3000/-'} />
                    </Form.Group>


                    <Form.Group className={'col-md-12'}>
                        <Form.Label>Rental Type</Form.Label>
                        <div className={'rental_type text_input px-4'}>
                            <Form.Check
                                inline
                                label="Cash"
                                value={'CASH'}
                                required
                                checked={formInput.paymentType === 'CASH'}
                                onChange={onChangeHandler}
                                name="paymentType"
                                type={'radio'}
                            />
                            <Form.Check
                                inline
                                label="Cheque"
                                required
                                value={'CHEQUE'}
                                checked={formInput.paymentType === 'CHEQUE'}
                                onChange={onChangeHandler}
                                name="paymentType"
                                type={'radio'}
                            />
                            <Form.Check
                                inline
                                label="Credit Card"
                                required
                                value={'CREDIT_CARD'}
                                checked={formInput.paymentType === 'CREDIT_CARD'}
                                onChange={onChangeHandler}
                                name="paymentType"
                                type={'radio'}
                            />
                            <Form.Check
                                inline
                                label="Online Transfer"
                                required
                                value={'ONLINE_TRANSFER'}
                                checked={formInput.paymentType === 'ONLINE_TRANSFER'}
                                onChange={onChangeHandler}
                                name="paymentType"
                                type={'radio'}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Rental Type</Form.Label>
                        <div className={'d-flex justify-content-between rental_type py-4 px-4'}>
                            <Form.Check
                                inline
                                label="With Driver"
                                required
                                value={'WITH_DRIVER'}
                                checked={formInput.rentalType === 'WITH_DRIVER'}
                                onChange={onChangeHandler}
                                name="rentalType"
                                type={'radio'}
                            />
                            <Form.Check
                                inline
                                label="Without Driver"
                                name="rentalType"
                                required
                                value={'WITHOUT_DRIVER'}
                                checked={formInput.rentalType === 'WITHOUT_DRIVER'}
                                onChange={onChangeHandler}
                                type={'radio'}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Charge Type</Form.Label>
                        <div className={'rental_type text_input px-4'}>
                            <Form.Check
                                inline
                                label="Monthly Charge"
                                value={'MONTHLY'}
                                required
                                checked={formInput.rentalCharge === 'MONTHLY'}
                                onChange={onChangeHandler}
                                name="rentalCharge"
                                type={'radio'}
                            />
                            <Form.Check
                                inline
                                label="Daily Charge"
                                required
                                value={'DAILY'}
                                checked={formInput.rentalCharge === 'DAILY'}
                                onChange={onChangeHandler}
                                name="rentalCharge"
                                type={'radio'}
                            />
                        </div>
                    </Form.Group>
                </div>
                <div className={'text-right mt-3'}>
                    <button type={'submit'} disabled={customerValidation()} className={'px-4 py-2 '}>Save</button>
                </div>
            </Form>
        )
    }

    if (isError) {
        return <DisplayError error={error}/>
    }

    return data
};

export default CreateNewRental;

