import React, {FC, useEffect} from 'react';
import * as IoIcons from 'react-icons/io5';
import * as BsIcons from 'react-icons/bs';
import * as AiIcons from 'react-icons/ai';
import * as FaIcons from 'react-icons/fa'
import {Col, Row} from "react-bootstrap";
import Stats from "../../component/Stats/Stats";
import '../../component/Stats/Stats.css';
import axios from "axios";


const Dashboard: FC = () => {

    const [stats, setStats] = React.useState({
        totalCars: 0,
        totalInActiveCars: 0,
        totalActiveCars: 0,
        monthlyIncome: 0,
        dailyIncome: 0,
        monthlyExpense: 0
    })

    useEffect(() => {
        axios.get('/dashboard')
            .then((res) => {
                setStats({
                    ...res.data,
                })
            })
    }, [])


    const cardStats = [
        {
            title: 'Total Cars',
            value: stats.totalCars,
            icon: <IoIcons.IoCarSportSharp className='pl-4 dashboard_icon'/>
        },
        {
            title: 'Total Active Cars',
            value: stats.totalActiveCars,
            icon: <IoIcons.IoCarSportSharp className='pl-4 dashboard_icon'/>
        },
        {
            title: 'Total InActive Cars',
            value: stats.totalInActiveCars,
            icon: <IoIcons.IoCarSportSharp className='pl-4 dashboard_icon'/>
        },
        {
            title: 'Monthly Income',
            value: stats.monthlyIncome,
            icon: <AiIcons.AiOutlineMoneyCollect className='pl-4 dashboard_icon' />
        },
        {
            title: 'Daily Income',
            value: stats.dailyIncome,
            icon: <FaIcons.FaMoneyBillAlt className='pl-4 dashboard_icon' />
        },
        {
            title: 'Monthly Expense',
            value: stats.monthlyExpense,
            icon: <BsIcons.BsFillCalendarMonthFill className='pl-4 dashboard_icon' />
        }
    ]



    return (
        <div className="page_responsive">
            <h5>Overview</h5>
            <Row className={'mt-4'}>
                {
                    cardStats.map((item, index) => (
                        <Col md={4} key={index}>
                            <Stats title={item.title} value={item.value} icon={item.icon} />
                        </Col>
                    ))
                }
            </Row>
        </div>
    );
};

export default Dashboard;
