import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import { useCreateBrandMutation, useCreateModelMutation, useCreateYearMutation, useFetchBrandOptionQuery, useFetchModelOptionQuery } from "../../../redux/apiSlice";
import {SelectOptions} from "../../Rental/CreateRental/CreateRental";
import './CreateVehicle.css';
import Select from "react-select";
import DisplayError from "../../../component/DisplayError/DisplayError";
import {successNotify} from "../../../utils/toast";
import OverLaySpinner from "../../../lib/Spinner/Spinner";

const CreateVehicle= () => {


    const [selectedBrand, setSelectedBrand] = useState<SelectOptions | null>(null);
    const [selectedModel, setSelectedModel] = useState<SelectOptions | null>(null)
    const [vehicleInput, setVehicleInput] = useState({
        brand: '',
        model: '',
        year: ''
    });

    const {data: brandOption = []} = useFetchBrandOptionQuery('');

    const {data: modelOption = []} = useFetchModelOptionQuery('');

    const [createBrand, {isLoading: isBrandLoading, error: brandError, isError: isBrandError, isSuccess: isBrandSuccess}] = useCreateBrandMutation();
    const [createModel, {isLoading: isModelLoading, error: modelError, isError: isModelError, isSuccess: isModelSuccess}] = useCreateModelMutation();
    const [createYear, {isLoading: isYearLoading, error: yearError, isError: isYearError, isSuccess: isYearSuccess}] = useCreateYearMutation();

    useEffect(() => {
        if (isBrandSuccess) {
            setVehicleInput({
                ...vehicleInput,
                brand: ''
            })
            successNotify('Brand Successfully Created!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBrandSuccess])

    useEffect(() => {
        if (isModelSuccess) {
            setSelectedBrand(null)
            setVehicleInput({
                ...vehicleInput,
                model: ''
            })
            successNotify('Model Successfully Created!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModelSuccess])

    useEffect(() => {
        if (isYearSuccess) {
            setSelectedModel(null)
            setVehicleInput({
                ...vehicleInput,
                year: ''
            })
            successNotify('Year Successfully Created!');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isYearSuccess])

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVehicleInput({
            ...vehicleInput,
            [name]: value
        })
    }

    const onAddBrandHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await createBrand({name: vehicleInput.brand});
    }

    const onAddModelHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        await createModel({ name: vehicleInput.model, id: selectedBrand?.value});
    }

    const onAddYearHandler =  async (e: React.FormEvent) => {
        e.preventDefault();
       await createYear({ name: vehicleInput.year, id: selectedModel?.value});
    }


    const selectBrandValidation = () => {
        return !selectedBrand;
    }

    const selectModelValidation = () => {
        return !selectedModel
    }




    let data = <OverLaySpinner isActive={isBrandLoading || isModelLoading || isYearLoading}/>

    if(!isBrandLoading || !isModelLoading || !isYearLoading) {
        data = (
            <div className={'page_responsive'}>
                <h5>Create Vehicle</h5>
                <Form onSubmit={onAddBrandHandler}>
                    <div className={'form-row create_form justify-content-center' }>
                        <Form.Group className={'col-md-12'}>
                            <Form.Label>Brand Name</Form.Label>
                            <Form.Control name={'brand'} placeholder={'Honda'} required type="text" value={vehicleInput.brand} onChange={onChangeHandler}/>
                        </Form.Group>
                        <div className={'col-md-12 text-right'}>
                            <button type={'submit'} className={'px-4 py-1 mt-2 save__btn'}>Add</button>
                        </div>
                    </div>
                </Form>
                <Form onSubmit={onAddModelHandler}>
                    <div className={'form-row mt-3 sub_form'}>
                        <Form.Group className={'col-md-6 mb-3'}>
                            <Form.Label>Brand Name</Form.Label>
                            <Select
                                placeholder={'Select Brand'}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                value={selectedBrand}
                                options={brandOption}
                                onChange={(value) => setSelectedBrand(value)}
                            />
                        </Form.Group>
                        <Form.Group className={'col-md-6'}>
                            <Form.Label>Model Name</Form.Label>
                            <Form.Control name={'model'} type={'text'} placeholder={'Civic'} required value={vehicleInput.model}  onChange={onChangeHandler} />
                        </Form.Group>
                        <div className={'col-md-12 text-right'}>
                            <button type={'submit'} disabled={selectBrandValidation()} className={'px-4 py-1 mt-2 save__btn'}>Add</button>
                        </div>
                    </div>
                </Form>

                <Form onSubmit={onAddYearHandler}>
                    <div className={'form-row mt-3 sub_form justify-content-center'}>
                        <Form.Group className={'col-md-6 mb-3'}>
                            <Form.Label>Model Name</Form.Label>
                            <Select
                                placeholder={'Select Model'}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                value={selectedModel}
                                options={modelOption}
                                onChange={(value) => setSelectedModel(value)}
                            />

                        </Form.Group>
                        <Form.Group className={'col-md-6'}>
                            <Form.Label>Year</Form.Label>
                            <Form.Control type={'text'} name={'year'} required value={vehicleInput.year} placeholder={'2014'}  onChange={onChangeHandler} />
                        </Form.Group>
                        <div className={'col-md-12 text-right'}>
                            <button type={'submit'} disabled={selectModelValidation()} className={'px-4 py-1 mt-2 save__btn'}>Add</button>
                        </div>                </div>
                </Form>
            </div>
        )
    }

    if (isBrandError) {
        return <DisplayError error={brandError} />
    }
    if (isModelError) {
        return <DisplayError error={modelError} />
    }

    if (isYearError) {
        return <DisplayError error={yearError} />
    }

    return data
};

export default CreateVehicle;
