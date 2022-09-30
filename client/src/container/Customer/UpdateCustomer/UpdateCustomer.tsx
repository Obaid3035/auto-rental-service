import React, {useEffect} from 'react';
import {Form} from "react-bootstrap";
import { useUpdateCustomerMutation } from "../../../redux/apiSlice";
import useForm from "../../../utils/useForm";
import {useNavigate, useParams} from "react-router-dom";
import '../CreateCustomer/CreateCustomer.css'
import OverLaySpinner from "../../../lib/Spinner/Spinner";
import DisplayError from "../../../component/DisplayError/DisplayError";
import axios from "axios";
import {successNotify} from "../../../utils/toast";


const UpdateCustomer = () => {
    const navigation = useNavigate();

    const [ updateCustomer , { isLoading, isError, error, isSuccess } ] = useUpdateCustomerMutation();
    const { id } = useParams();
    if(isSuccess) {
        successNotify('Customer updated successfully');
        navigation('/customers')
    }

    const onSubmitHandler = async () => {
        await updateCustomer({ id, data: values});
    }

    const {handleChange, values, setValues,handleSubmit} = useForm(onSubmitHandler);

   useEffect(() => {
       axios.get('/customer/'+ id)
           .then((res) => {
               setValues({
                   ...res.data
               })
           })
       // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

    let data = <OverLaySpinner isActive={isLoading}/>

    if (!isLoading) {
        data = (
            <Form onSubmit={handleSubmit}>
                <div className="form-row create_form">
                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            Name
                        </Form.Label>
                        <Form.Control name="name"  className={'text_input'} value={values.name} type={'text'} placeholder="Muhammad Ismail" onChange={handleChange}/>
                    </Form.Group>


                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            CNIC #
                        </Form.Label>
                        <Form.Control name='cnic' className={'text_input'} value={values.cnic} type={'number'} placeholder="1234-1234567-1" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            Passport #
                        </Form.Label>
                        <Form.Control name='passport' className={'text_input'} value={values.passport}  type={'text'} placeholder="12345-6789101-1" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            Residential Address
                        </Form.Label>
                        <Form.Control name='residentialAddress' className={'text_input'} value={values.residentialAddress}  type={'text'} placeholder="ABC Area Sample road, Khi" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>
                            Office Address
                        </Form.Label>
                        <Form.Control name='officeAddress' className={'text_input'} value={values.officeAddress} type={'text'} placeholder="ABC Area Sample road, Khi" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Phone #
                        </Form.Label>
                        <Form.Control name='phone' className={'text_input'} value={values.phone} type={'text'} placeholder="03xx-xxxxxxx" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>License #
                        </Form.Label>
                        <Form.Control name='license' className={'text_input'} value={values.license} type={'text'} placeholder="1234-783-AB" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Reference Name
                        </Form.Label>
                        <Form.Control name='referenceName' className={'text_input'} value={values.referenceName} type={'text'} placeholder="Muhammad Ismail" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Reference Phone #
                        </Form.Label>
                        <Form.Control name='referencePhone' className={'text_input'} value={values.referencePhone}  type={'text'} placeholder="0312-1234567" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Reference Address
                        </Form.Label>
                        <Form.Control name='referenceAddress' className={'text_input'} value={values.referenceAddress} type={'text'} placeholder="ABC Area Sample road, Khi" onChange={handleChange}/>
                    </Form.Group>

                    <Form.Group className={'col-md-6'}>
                        <Form.Label>Reference CNIC #
                        </Form.Label>
                        <Form.Control name='referenceCnic' className={'text_input'} value={values.referenceCnic}  type={'text'} placeholder="1234-1234567-1" onChange={handleChange}/>
                    </Form.Group>
                </div>
                <div className={'text-right mt-3'}>
                    <button type={'submit'} className={'px-4 py-2 '}>Update</button>
                </div>
            </Form>
        )
    }

    if (isError) {
        return <DisplayError error={error}/>
    }


    return (
        <div className={'page_responsive'}>
            <h5>Edit Customer</h5>
            <div>
                { data }
            </div>
        </div>
    );
};

export default UpdateCustomer;
