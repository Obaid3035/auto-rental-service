import React, {useEffect} from 'react';
import {Form} from "react-bootstrap";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import {TextField} from "@mui/material";
import {useCreateCloseRentalMutation} from "../../../redux/apiSlice";
import {useParams} from "react-router-dom";
import axios from "axios";
import OverLaySpinner from "../../../lib/Spinner/Spinner";
import DisplayError from "../../../component/DisplayError/DisplayError";
import { useNavigate } from "react-router-dom";
import {successNotify} from "../../../utils/toast";

interface IFormInput {
    receiverName: string,
    paid: number,
    discount: number,
    currentBalance: number
}

const CloseRental = () => {

    const navigation = useNavigate();

    const { id } = useParams();

    const [ closeRental , { isLoading, isError, error, isSuccess } ] = useCreateCloseRentalMutation();

    if(isSuccess) {
        successNotify('Rental Closed Successfully!')
       navigation('/rentals');
    }


    useEffect(() => {
        axios.get('rental-balance/' + id)
            .then((res) => {
                setFormInput({
                    ...formInput,
                    currentBalance: res.data.balance
                })
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const [issueDate, setIssueDate] = React.useState<Date | null>(
        new Date(),
    );

    const [formInput, setFormInput] = React.useState<IFormInput>({
        receiverName: '',
        paid: 0,
        discount: 0,
        currentBalance: 0
    })

    const handleChange = (date: Date | null) => {
        if (date) {
            setIssueDate(date);
        }
    };

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormInput({
            ...formInput,
            [name]: value
        })

    }

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            issueDate,
            receiverName: formInput.receiverName,
            paid: formInput.paid,
            totalBalance: calculateTotalBalance(),
            discount: formInput.discount
        }

        await closeRental({ params: id, data: formData})
    }

    const calculateTotalBalance = () => {
        let totalBalance = formInput.currentBalance - formInput.paid;
        if (formInput.discount > 0) {
            totalBalance -= formInput.discount
        }
        return totalBalance
    }


    let data = <OverLaySpinner isActive={isLoading}/>
    if (!isLoading) {
        data = (
            <Form onSubmit={onSubmitHandler}>
                <div className="form-row create_form align-items-center">

                    <Form.Group className="col-md-6">
                        <Form.Label>Receiver Name</Form.Label>
                        <Form.Control name={'receiverName'} required onChange={onChangeHandler} className={'text_input'} type={'text'} placeholder={'Ismail Khan'} />
                    </Form.Group>
                    <Form.Group className="col-md-6">
                        <div style={{
                            marginTop: '38px'
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    label="Issue Date And Time"
                                    value={issueDate}
                                    onChange={handleChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </div>
                    </Form.Group>

                    <Form.Group className="col-md-3">
                        <Form.Label>Current Balance</Form.Label>
                        <Form.Control value={formInput.currentBalance} disabled className={'text_input'} type={'number'} placeholder={'3000/-'} />
                    </Form.Group>
                    <Form.Group className="col-md-3">
                        <Form.Label>Enter Amount</Form.Label>
                        <Form.Control name={'paid'} onChange={onChangeHandler} required className={'text_input'} type={'number'} placeholder={'3000/-'} />
                    </Form.Group>
                    <Form.Group className="col-md-3">
                        <Form.Label>Enter Discount</Form.Label>
                        <Form.Control name={'discount'} onChange={onChangeHandler} required  className={'text_input'} type={'number'} placeholder={'100/-'} />
                    </Form.Group>
                    <Form.Group className="col-md-3">
                        <Form.Label>Total Balance</Form.Label>
                        <Form.Control name={'balance'} value={calculateTotalBalance()} disabled className={'text_input'} type={'number'} placeholder={'3000/-'} />
                    </Form.Group>

                </div>
                <div className={'text-right mt-3'}>
                    <button type={'submit'} disabled={calculateTotalBalance() > 0} className={'px-4 py-2 '}>Save</button>
                </div>
            </Form>

        )
    }

    if (isError) {
        return <DisplayError error={error}/>
    }

    return (
        <div className={'page_responsive'}>
            <h5 >Close Rental</h5>
            <div>
                { data }
            </div>
        </div>
    );
};

export default CloseRental;
