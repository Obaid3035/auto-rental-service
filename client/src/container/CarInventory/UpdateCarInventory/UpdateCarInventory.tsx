import React, {useState, useEffect} from 'react';
import {Form} from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import {SelectOptions} from "../../Rental/CreateRental/CreateRental";
import {useUpdateCarInventoryMutation} from "../../../redux/apiSlice";
import OverLaySpinner from "../../../lib/Spinner/Spinner";
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {successNotify} from "../../../utils/toast";



export interface FormInput {
    regNo: string,
    color: string,
    horsePower: string,
    transmission: string,
    tariff: string,
}

const UpdateCarInventory = () => {
    const navigation = useNavigate();

    const [selectedBrand, setSelectedBrand] = useState<SelectOptions | null>(null);
    const [selectedModel, setSelectedModel] = useState<SelectOptions | null>(null)
    const [selectedYear, setSelectedYear] = useState<SelectOptions | null>(null);

    const [brandOptions, setBrandOptions] = useState([])
    const [modelOptions, setModelOptions] = useState([])
    const [yearOptions, setYearOptions] = useState([])

    const { id } = useParams()

    const [updateCarInventory, { isLoading, isSuccess }] = useUpdateCarInventoryMutation();

    if(isSuccess) {
        successNotify('Car Inventory Updated Successfully!')
        navigation('/car-inventory');
    }
    const [formInput, setFormInput] = useState<FormInput>({
        regNo: '',
        color: '',
        horsePower: '',
        transmission: '',
        tariff: '',
    });

    useEffect(() => {
        axios.get('/vehicle/brand-options')
            .then((res) => {
                setBrandOptions(res.data)
            })
    }, [])

    useEffect(() => {
        if (selectedBrand && selectedBrand.value) {
            axios.get(`/vehicle/model-options/${selectedBrand?.value}`)
                .then((res) => {
                    setModelOptions(res.data)
                })
        }
    }, [selectedBrand])

    useEffect(() => {
        if (selectedModel && selectedModel.value) {
            axios.get(`/vehicle/year-options/${selectedModel?.value}`)
                .then((res) => {
                    setYearOptions(res.data)
                })
        }
    }, [selectedModel])
    useEffect(() => {
        axios.get(`/car-inventory/${id}`)
            .then((res) => {
                setSelectedBrand(res.data.brand)
                setSelectedModel(res.data.model)
                setSelectedYear(res.data.year)
                setFormInput({
                    ...res.data
                })
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])




    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormInput({
            ...formInput,
            [name]: value
        })
    }


    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedBrand && selectedModel && selectedYear) {
            const formData = {
                ...formInput,
                brand: selectedBrand?.value,
                model: selectedModel.value,
                year: selectedYear.value,
                brandName: selectedBrand.label,
                modelName: selectedModel.label,
                yearName: selectedYear.label,
            }

            updateCarInventory({data: formData, id})
        }

    }

    const onSelectBrandChangedHandler = (value: SelectOptions | null) => {
        setSelectedBrand(value);
        setSelectedModel(null);
        setSelectedYear(null);
    }

    const onSelectModelChangedHandler = (value: SelectOptions | null) => {
        setSelectedModel(value);
        setSelectedYear(null);
    }


    let data = <OverLaySpinner isActive={isLoading}/>

    const updateCarValidate = () => {
        return !(selectedBrand && selectedModel && selectedYear);

    }

    if (!isLoading) {
        data = (
            <div className={'page_responsive'}>
                <h5 >Edit Car Inventory</h5>
                <div>
                    <Form onSubmit={onSubmitHandler}>
                        <div className="form-row create_form">
                            <Form.Group className={'col-md-6'}>
                                <Form.Label>Registration No#</Form.Label>
                                <Form.Control name={'regNo'} value={formInput.regNo} onChange={onChangeHandler} required className={'text_input'} type="text" placeholder="A-001"/>
                            </Form.Group>
                            <Form.Group className={'col-md-6'}>
                                <Form.Label>Brand</Form.Label>
                                <Select
                                    placeholder={'Select Brand'}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="color"
                                    value={selectedBrand}
                                    options={brandOptions}
                                    onChange={(value) => onSelectBrandChangedHandler(value)}
                                />
                            </Form.Group>
                            <Form.Group className={'col-md-6'}>
                                <Form.Label>Model</Form.Label>
                                {
                                    selectedBrand ?
                                        <Select
                                            placeholder={'Select Model'}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            value={selectedModel}
                                            options={modelOptions}
                                            onChange={(value) => onSelectModelChangedHandler(value)}
                                        />
                                        : <p className={'text-muted'}>Select Brand First</p>
                                }
                            </Form.Group><Form.Group className={'col-md-6'}>
                            <Form.Label>Year</Form.Label>
                            {
                                selectedModel ?
                                    <Select
                                        placeholder={'Select Model'}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        value={selectedYear}
                                        options={yearOptions}
                                        onChange={(value) => setSelectedYear(value)}
                                    />
                                    : <p className={'text-muted'}>Select Year First</p>
                            }
                        </Form.Group>
                            <Form.Group className={'col-md-6'}>
                                <Form.Label>Color</Form.Label>
                                <Form.Control name={'color'} value={formInput.color} onChange={onChangeHandler} className={'text_input'} type="text" placeholder="White"/>
                            </Form.Group>
                            <Form.Group className={'col-md-6'}>
                                <Form.Label>HorsePower</Form.Label>
                                <Form.Control name={'horsePower'} value={formInput.horsePower} onChange={onChangeHandler} className={'text_input'} type="text" placeholder="123"/>
                            </Form.Group>
                            <Form.Group className={'col-md-6'}>
                                <Form.Label>Transmission</Form.Label>
                                <Form.Control name={'transmission'} value={formInput.transmission} onChange={onChangeHandler} className={'text_input'} type="text" placeholder="ABC"/>
                            </Form.Group>
                            <Form.Group className={'col-md-6'}>
                                <Form.Label>Tariff</Form.Label>
                                <Form.Control name={'tariff'} required value={formInput.tariff} onChange={onChangeHandler} className={'text_input'} type="text" placeholder="3500/-"/>
                            </Form.Group>
                        </div>
                        <div className={'text-right mt-3'}>
                            <button type={'submit'} disabled={updateCarValidate()} className={'px-4 py-2 '}>Update</button>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }

    return data
};

export default UpdateCarInventory;
