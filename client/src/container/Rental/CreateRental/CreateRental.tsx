import React, {useState} from 'react';
import {Tab, Tabs} from "react-bootstrap";
import CreateNewRental from "./CreateNewRental/CreateNewRental";
import CreatePastRental from "./CreatePastRental/CreatePastRental";

export interface SelectOptions {
    label: string;
    value: string;
    tariff?: number;
}


const CreateRental = () => {

    const [key, setKey] = useState('active')
    return (
        <div className="page_responsive rental_div">
            { key === 'active' ? <h2>Create New Rental</h2> : <h2>Create Past Rental</h2>}
            <div>
                <Tabs
                    activeKey={key}
                    onSelect={(k) => {
                        if (k) {
                            setKey(k)
                        }
                    }}
                    className="mb-3 tabs"
                >
                    <Tab eventKey="active" title="Active" className={'w-100'}>
                        <CreateNewRental />
                    </Tab>
                    <Tab eventKey="past" title="Past" className={'w-100'}>
                        <CreatePastRental />
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default CreateRental;
