import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import AsyncSelect from "react-select/async";
import axios from "axios";
import {SelectOptions} from "../../../Rental/CreateRental/CreateRental";
import * as AiIcons from "react-icons/ai";
import {errorNotify, successNotify} from "../../../../utils/toast";
import '../Expense.css'
import { useAppDispatch, useAppSelector } from "../../../../redux/hook";
import {setTotalExpense} from "../../../../redux/slice/generalSlice";
import {IExpense} from "../Expense";
import { useCreateExpenseMutation } from "../../../../redux/apiSlice";
import OverLaySpinner from "../../../../lib/Spinner/Spinner";



const CarExpense = (props: { tab: string }) => {

    const dispatch = useAppDispatch();
    const totalExpense = useAppSelector(state => state.general.totalExpense);

    const [selectedVehicle, setSelectedVehicle] = useState<SelectOptions | null>(null);
    const [expenses, setExpenses] = useState<Partial<IExpense[]>>([]);

    const [createExpense, { isLoading, isSuccess, }] = useCreateExpenseMutation();


    useEffect(() => {
        if (isSuccess) {

            successNotify('Car CreateExpense Created Successfully!');
        }
    }, [isSuccess])



    useEffect(() => {
       if (props.tab === 'car') {
           if (expenses.length > 0) {
               // @ts-ignore
               let totalExpense = expenses.reduce((preVal: number, curVal: IExpense) => {
                   if (curVal) {
                       return preVal + +curVal.amount
                   }
                   return 0
               }, 0)
               dispatch(setTotalExpense(totalExpense))
           } else {
               dispatch(setTotalExpense(0))
           }
       }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tab])


    const [formInput, setFormInput] = useState({
        description: '',
        amount: 0
    });

    const onAddHandler = () => {
        if (!selectedVehicle) {
            errorNotify('Please Select A Vehicle First')
        } else if (!(formInput.description.length > 0) && !(parseInt(String(formInput.amount)) > 0)) {
            errorNotify('Description is required')
        } else {
            let expenseClone = expenses.concat();
            let currentExpense = {
                description: formInput.description,
                amount: formInput.amount
            }
            expenseClone.push(currentExpense);

            setExpenses(expenseClone);
            setFormInput({
                description: '',
                amount: 0
            })

            // @ts-ignore
            let totalExpense = expenseClone.reduce((preVal: number, curVal: IExpense) => {
                if (curVal) {
                    return preVal + +curVal.amount
                }
                return 0;
            }, 0)
            dispatch(setTotalExpense(totalExpense))
        }
    }

    const vehiclePromise = () =>
        new Promise((resolve) => {
            axios.get('/car-inventory-all-options')
                .then((res) => {
                    resolve(res.data);
                })
        });

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormInput({
            ...formInput,
            [name]: value
        })
    }

    const onRemoveHandler = (index: number) => {
        let expenseClone = expenses.concat();
        if (expenseClone.length > 0) {
            dispatch(setTotalExpense(totalExpense - +((expenseClone[index])!.amount)))
            expenseClone.splice(index, 1);
            setExpenses(expenseClone);
        }
    }


    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (expenses.length > 0 && selectedVehicle) {
            const formData = {
                expenseType: 'CAR_EXPENSE',
                vehicle: selectedVehicle?.value,
                allExpense: expenses,
                totalExpense: totalExpense
            }
            await createExpense(formData)
        } else {
            errorNotify('Please Enter All Details!');
        }
        setSelectedVehicle(null)
        setExpenses([]);
    }



    let data = <OverLaySpinner isActive={isLoading} />
    if (!isLoading) {
        data = (
            <div>
                <Form onSubmit={onSubmitHandler}>
                    <div className={'form-row create_form expense align-items-end'}>
                        <Form.Group className={'col-md-12'}>
                            <Form.Label>
                                Choose Vehicle
                            </Form.Label>
                            <AsyncSelect
                                placeholder={'Select Vehicle'}
                                cacheOptions
                                defaultOptions
                                loadOptions={vehiclePromise}
                                onChange={(value) => {
                                    setSelectedVehicle(value)
                                }}

                                value={selectedVehicle}
                            />
                        </Form.Group>
                        <Form.Group className={'col-md-6'}>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name={'description'} value={formInput.description} onChange={onChangeHandler} />
                        </Form.Group>
                        <Form.Group className={'col-md-5'}>
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" name={'amount'}  value={formInput.amount} onChange={onChangeHandler}  />
                        </Form.Group>
                        <div className="col-md-1 text-right">
                            <AiIcons.AiFillPlusCircle onClick={onAddHandler} />
                        </div>
                        {
                            expenses.length > 0 && expenses.map((item, index) => (
                                <React.Fragment key={index}>

                                    <Form.Group className={'col-md-6 mt-3 animate__animated animate__fadeInDown'}>
                                        <Form.Control type="text" name={'description'} disabled value={item && item.description}  />
                                    </Form.Group>
                                    <Form.Group className={'col-md-5 animate__animated animate__fadeInDown'}>
                                        <Form.Control type="number" name={'amount'} disabled  value={item && item.amount}   />
                                    </Form.Group>
                                    <div className="col-md-1 text-right animate__animated animate__fadeInDown">
                                        <AiIcons.AiFillMinusCircle onClick={() => onRemoveHandler(index)} />
                                    </div>
                                </React.Fragment>
                            ))
                        }
                        <button type={'submit'} className={'py-2 px-3 mt-3'}>Submit</button>
                    </div>
                </Form>
            </div>
        )
    }

    return data;
};

export default CarExpense;
