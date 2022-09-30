import React from 'react';
import {Form} from "react-bootstrap";
import { useCreateCustomerMutation } from "../../../redux/apiSlice";
import useForm from "../../../utils/useForm";
import './CreateCustomer.css'
import OverLaySpinner from "../../../lib/Spinner/Spinner";
import DisplayError from "../../../component/DisplayError/DisplayError";
import { useNavigate } from "react-router-dom";
import {successNotify} from "../../../utils/toast";


const CreateCustomer = () => {
    const navigation = useNavigate();
    const [ createCustomer , { isLoading, isError, error, isSuccess } ] = useCreateCustomerMutation();
    if(isSuccess) {
        successNotify('Customer Created Successfully!')
        navigation('/customers');
    }
    const onSubmitHandler = async () => {
        await createCustomer(values);
    }

    const {handleChange, values, handleSubmit} = useForm(onSubmitHandler);

    let data = <OverLaySpinner isActive={isLoading}/>

    if (!isLoading) {
        data = (
            <Form onSubmit={handleSubmit}>
                <div className="form-row create_form">
                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            Name
                        </Form.Label>
                        <Form.Control name="name" required  className={'text_input'} type={'text'}  onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            CNIC #
                        </Form.Label>
                        <Form.Control name='cnic' required className={'text_input'} type={'number'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            Passport #
                        </Form.Label>
                        <Form.Control name='passport' className={'text_input'} type={'text'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            Residential Address
                        </Form.Label>
                        <Form.Control name='residentialAddress' required className={'text_input'} type={'text'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            Office Address
                        </Form.Label>
                        <Form.Control name='officeAddress' className={'text_input'} type={'text'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Phone #
                        </Form.Label>
                        <Form.Control name='phone' required className={'text_input'} type={'text'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>License #
                        </Form.Label>
                        <Form.Control name='license' className={'text_input'} type={'text'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Reference Name
                        </Form.Label>
                        <Form.Control name='referenceName' className={'text_input'} type={'text'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Reference Phone #
                        </Form.Label>
                        <Form.Control name='referencePhone' className={'text_input'} type={'text'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Reference Address
                        </Form.Label>
                        <Form.Control name='referenceAddress' className={'text_input'} type={'text'} onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Reference CNIC #
                        </Form.Label>
                        <Form.Control name='referenceCnic' className={'text_input'} type={'text'} onChange={handleChange}/>
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
            <h5>Create Customer</h5>
            <div>
                { data }
            </div>
        </div>
    );
};

export default CreateCustomer;
