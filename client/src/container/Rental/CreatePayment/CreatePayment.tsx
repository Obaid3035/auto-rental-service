import React from 'react';
import {Form} from "react-bootstrap";
import DateTimePicker from '@mui/lab/DateTimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {TextField} from "@mui/material";
import { useParams } from "react-router-dom";
import { useCreatePaymentMutation } from "../../../redux/apiSlice";
import OverLaySpinner from "../../../lib/Spinner/Spinner";
import DisplayError from "../../../component/DisplayError/DisplayError";
import { useNavigate } from "react-router-dom";
import {successNotify} from "../../../utils/toast";


const CreatePayment = () => {

    const { id } = useParams();
    const navigation = useNavigate();

    const [issueDate, setIssueDate] = React.useState<Date | null>(
        new Date(),
    );

    const [formInput, setFormInput] = React.useState({
        receiverName: '',
        paid: 0
    })

    const [ createPayment , { isLoading, isError, error, isSuccess } ] = useCreatePaymentMutation();

    if(isSuccess) {
        successNotify('Payment Create Successfully!')
        navigation('/rentals');
    }

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
            rental: id,
            issueDate,
            receiverName: formInput.receiverName,
            paid: formInput.paid
        }
        await createPayment(formData)
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

                    <Form.Group className="col-md-12">
                        <Form.Label>Enter Amount</Form.Label>
                        <Form.Control name={'paid'} required onChange={onChangeHandler} className={'text_input'} min={0} type={'number'} placeholder={'3000/-'} />
                    </Form.Group>

                </div>
                <div className={'text-right mt-3'}>
                    <button type={'submit'} className={'px-4 py-2 '}>Save</button>
                </div>
            </Form>
        )
    }

    if (isError) {
        return <DisplayError error={error}/>
    }


    return (
        <div className={'page_responsive'}>
            <h5 >Add Payment</h5>
            <div>
                { data }
            </div>
        </div>

    );
};

export default CreatePayment;

