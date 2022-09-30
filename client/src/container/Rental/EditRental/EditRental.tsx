import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import Select from "react-select";
import {SelectOptions} from "../CreateRental/CreateRental";
import {useEditRentalByIdMutation} from "../../../redux/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {successNotify} from "../../../utils/toast";

const EditRental = () => {
    const navigation = useNavigate();
    const { id } = useParams();
    const [editRental, { isSuccess }] = useEditRentalByIdMutation();
    if (isSuccess) {
        successNotify('Rental Updated Successfully!')
        navigation('/rentals');
    }

    const [selectedVehicle, setSelectedVehicle] = useState<SelectOptions | null>(null);
    const [vehicleOption, setVehicleOption] = useState([]);

    useEffect(() => {
        axios.get('/car-inventory-options')
            .then((res) => {
                setVehicleOption(res.data)
            })

    }, [])

    const [tariff, setTariff] = useState(selectedVehicle?.tariff)

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedVehicle) {
            const formData = {
                id,
                data: selectedVehicle?.value,
                tariff: tariff
            }
            await editRental(formData)
        }

    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>)  => {
        const { value } = e.target;

        setTariff(parseFloat(value))
    }

    return (
        <div className={'page_responsive'}>
            <h5 >Edit Rental</h5>
            <div>
                <Form onSubmit={onSubmitHandler}>
                    <div className="form-row create_form">
                        <Form.Group className={'col-md-6'}>
                            <Form.Label>Choose Vehicle</Form.Label>
                            <Select
                                placeholder={'Select Vehicle'}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                value={selectedVehicle}
                                options={vehicleOption}
                                onChange={(value) => {
                                    setSelectedVehicle(value)
                                    setTariff(value?.tariff)
                                }}
                            />
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>Tariff</Form.Label>
                            <Form.Control className={'text_input'} required name={'tariff'} value={tariff} onChange={onChangeHandler} type={'number'} placeholder={'0/-'} />
                        </Form.Group>
                    </div>
                    <div className={'text-right mt-3'}>
                        <button type={'submit'} disabled={!(selectedVehicle)} className={'px-4 py-2 '}>Save</button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EditRental;
