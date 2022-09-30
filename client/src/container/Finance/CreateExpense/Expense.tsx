import React from 'react';
import {Tab, Tabs} from "react-bootstrap";
import GeneralExpense from "./GeneralExpense/GeneralExpense";
import {useAppSelector} from "../../../redux/hook";
import CountUp from "react-countup";
import * as GiIcons from "react-icons/gi";
import CarExpense from "./CarExpense/CarExpense";

export interface IExpense {
    description: string,
    amount: number
}

const Expense = () => {

    const [key, setKey] = React.useState('general');

    const totalExpense = useAppSelector(state => state.general.totalExpense)

    return (
        <div className="page_responsive">
            <div className={'header'}>
                <h5>Create Expenses</h5>
                <div className={'d-flex align-items-center total_earning mb-4 justify-content-between'}>
                    <GiIcons.GiCash/>
                    <div>
                        <p className={'p-0 m-0'}>Expense</p>
                        <h5 className={'p-0 m-0'}>RS {<CountUp end={totalExpense} duration={0.7}/> }</h5>
                    </div>
                </div>
            </div>
            <Tabs
                activeKey={key}
                onSelect={(k) => {
                    if (k) {
                        setKey(k)
                    }
                }}
                className="mb-3 tabs"
            >
                <Tab eventKey="general" title="General" className={'w-100'}>
                    <GeneralExpense tab={key} />
                </Tab>
                <Tab eventKey="car" title={'Car'}  className={'w-100'}>
                    <CarExpense tab={key} />
                </Tab>
            </Tabs>
        </div>
    );
};

export default Expense;
