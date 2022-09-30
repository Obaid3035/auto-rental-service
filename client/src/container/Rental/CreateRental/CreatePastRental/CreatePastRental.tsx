import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {SelectOptions} from "../CreateRental";
import {useCreateRentalMutation} from "../../../../redux/apiSlice";
import {successNotify} from "../../../../utils/toast";
import axios from "axios";
import OverLaySpinner from "../../../../lib/Spinner/Spinner";
import {Form} from "react-bootstrap";
import Select from "react-select";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import {TextField} from "@mui/material";
import DisplayError from "../../../../component/DisplayError/DisplayError";

const CreatePastRental = () => {
    const navigation = useNavigate();
    const [selectedCustomer, setSelectedCustomer] = useState<SelectOptions | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<SelectOptions | null>(null);
    const [customerOption, setCustomerOption] = useState([]);
    const [vehicleOption, setVehicleOption] = useState([]);
    const [ createRental , { isLoading, isError, error, isSuccess } ] = useCreateRentalMutation();
    const [checked, setChecked] = React.useState<boolean>(false)
    const [days, setDays] = useState(0);

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
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormInput({
            ...formInput,
            [name]: value
        })
    }

    const issueDateHandler = (date: Date | null) => {
        if (date) {
            const nowDate = new Date()
            const days: number = nowDate.getTime() - date.getTime()
            setDays(Math.round(days / (1000 * 3600 * 24)))
            setIssueDate(date);
        }
    };

    const onDaysChangeHandler = () => {
        setChecked(!checked)
        if (checked) {
            setDays(days - 1)
        }
        else {
            setDays(days + 1)
        }
    }

    const getPastBalance = () => {
        if (selectedVehicle && formInput.tariff && days) {
            let finalTariff = 0;
            if (days > 0) {
                finalTariff = days * formInput.tariff
            }

            return finalTariff - formInput.advanceAmount
        }
        else {
            return 0
        }

    }


    const onPastSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedVehicle && selectedVehicle.tariff && formInput.tariff ) {
            let finalTariff = 0;
            if (days > 0) {
                finalTariff = days * formInput.tariff
            }

            const formData = {
                customer: selectedCustomer?.value,
                customerName: selectedCustomer?.label,
                vehicle: selectedVehicle?.value,
                vehicleNo: selectedVehicle?.label,
                issueDate,
                SON: formInput.SON,
                book: formInput.book,
                advanceAmount: formInput.advanceAmount,
                balance: finalTariff - formInput.advanceAmount,
                tariff: formInput.tariff,
                rentalCharge: "DAILY",
                rentalType: formInput.rentalType,
                paymentType: formInput.paymentType,
            }
            await createRental(formData)
        }
    }

    const customerValidation = () => {
        return !(selectedVehicle && selectedCustomer);
    }


    let data = <OverLaySpinner isActive={isLoading}/>

    if (!isLoading) {
        data = (
            <Form onSubmit={onPastSubmitHandler}>
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
                        <div className="tick-form">
                            <input className="form-check-input" type="checkbox" defaultChecked={checked}
                                   onChange={onDaysChangeHandler} id="flexCheckDefault" />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Select Today Date
                            </label>
                        </div>
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Days</Form.Label>
                        <Form.Control className={'text_input'} disabled name={'days'} type={'number'} value={days} placeholder={'0 days'} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>SON#</Form.Label>
                        <Form.Control className={'text_input'} required name={'SON'} onChange={onChangeHandler} type={'text'} placeholder={'1234'} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Book#</Form.Label>
                        <Form.Control className={'text_input'} required name={'book'} onChange={onChangeHandler} type={'text'} placeholder={'1234'} />
                    </Form.Group>

                    <Form.Group className="col-md-4">
                        <Form.Label>Advance Amount</Form.Label>
                        <Form.Control className={'text_input'} required name={'advanceAmount'} onChange={onChangeHandler} min={0} type={'number'} placeholder={'0/-'} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Tariff</Form.Label>
                        <Form.Control className={'text_input'} required name={'tariff'} value={formInput.tariff} min={0} onChange={onChangeHandler} type={'number'} placeholder={'0/-'} />
                    </Form.Group>
                    <Form.Group className="col-md-4">
                        <Form.Label>Balance</Form.Label>
                        <Form.Control className={'text_input'} required name={'balance'} disabled value={getPastBalance()} type={'number'} placeholder={'3000/-'} />
                    </Form.Group>
                    <Form.Group className={'col-md-4'}>
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

                    <Form.Group className={'col-md-8'}>
                        <Form.Label>Rental Type</Form.Label>
                        <div className={'d-flex justify-content-between rental_type text_input px-4'}>
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

                    {/*<Form.Group className={'col-md-6'}>*/}
                    {/*    <Form.Label>Charge Type</Form.Label>*/}
                    {/*    <div className={'rental_type text_input px-4'}>*/}
                    {/*        <Form.Check*/}
                    {/*            inline*/}
                    {/*            label="Monthly Charge"*/}
                    {/*            value={'MONTHLY'}*/}
                    {/*            required*/}
                    {/*            checked={formInput.rentalCharge === 'MONTHLY'}*/}
                    {/*            onChange={onChangeHandler}*/}
                    {/*            name="rentalCharge"*/}
                    {/*            type={'radio'}*/}
                    {/*        />*/}
                    {/*        <Form.Check*/}
                    {/*            inline*/}
                    {/*            label="Daily Charge"*/}
                    {/*            required*/}
                    {/*            value={'DAILY'}*/}
                    {/*            checked={formInput.rentalCharge === 'DAILY'}*/}
                    {/*            onChange={onChangeHandler}*/}
                    {/*            name="rentalCharge"*/}
                    {/*            type={'radio'}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</Form.Group>*/}
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

export default CreatePastRental;
