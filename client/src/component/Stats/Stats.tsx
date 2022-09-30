import React from 'react';
import './Stats.css';
import CountUp from "react-countup";

export interface IStats {
    title: string,
    value: number,
    icon?: JSX.Element
}

const Stats = (props: IStats) => {
    return (
        <div className="d-flex w-100 dashboard_card mt-4 justify-content-between align-items-center">
            <div>
                <p>{ props.title }</p>
                <p className={'value'}> <CountUp end={ props.value } duration={1}/></p>
            </div>
            <div>
                { props.icon }
            </div>
        </div>

    );
};

export default Stats;
