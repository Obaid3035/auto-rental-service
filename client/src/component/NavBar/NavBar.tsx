import React, {useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as FiIcons from "react-icons/fi";
import * as IoIcons from 'react-icons/io';
import {sideBarItems, SideBarRoutes} from "./routes";
import './NavBar.css'
import {Collapse} from "@mui/material";

const NavBar = () => {

    const location = useLocation();
    const [sideBar, setSideBar] = useState(false)
    const showSideBar = () => setSideBar(!sideBar);
    const [subNav, setSubNav] = useState(false);

    const onLogOutHandler = () => {
        localStorage.clear();
        window.location.reload();
    }

    const classes = (path: string) => {
        if (path === location.pathname) {
            return 'nav_active'
        }
        return ''
    }

    return (
        <>
            <div className={sideBar ? 'sidebar active' : 'sidebar'}>
                <div className={'logo_content'}>
                    <div className={'profile'}>
                        <img alt={'profile'} src={`${process.env.PUBLIC_URL}/img/icon.png`}/>
                        <p className={'mb-0'}>Auto Cars</p>
                    </div>
                    <FaIcons.FaBars className={'fa-bars'} onClick={showSideBar} />
                </div>
                <ul className="nav_list p-0">
                    {
                        sideBarItems.map((item: SideBarRoutes, index) =>{
                            if (!item.isSubNav && item.path) {
                                return  (
                                    <li key={index} className={`${classes(item.path)}`}>
                                        <div>
                                            <Link to={item.path}>
                                                { item.icon }
                                                <span>{ item.title }</span>
                                            </Link>
                                        </div>
                                    </li>
                                )
                            } else {
                                return (
                                    <React.Fragment>
                                        <li key={index} onClick={() => setSubNav(!subNav)}>
                                            <div>
                                                <Link to={'#'}>
                                                    { item.icon }
                                                    <span>{ item.title }</span>
                                                    {
                                                        !subNav ?
                                                            <IoIcons.IoMdArrowDropright className={sideBar ? '' : 'subNav'}/>
                                                            : <IoIcons.IoMdArrowDropdown className={sideBar ? '' : 'subNav'}/>
                                                    }
                                                </Link>
                                            </div>
                                        </li>
                                        {
                                            item.subNav ?
                                                <Collapse in={subNav}>
                                                   <React.Fragment>
                                                       {
                                                           item.subNav.map((subItem: {path: string, title: string}, index: number) => (
                                                               <li className={`${classes(subItem.path)} ml-4`} key={index}>
                                                                   <div>
                                                                       <Link to={subItem.path}>
                                                                <span style={{
                                                                    fontSize: '14px'
                                                                }}>{ subItem.title }</span>
                                                                       </Link>
                                                                   </div>
                                                               </li>
                                                           ))
                                                       }
                                                   </React.Fragment>
                                                </Collapse>
                                                : null
                                        }
                                    </React.Fragment>
                                )
                            }
                        })
                    }
                    <li className="logout_btn" onClick={onLogOutHandler}>
                        <Link to={'#'}>
                            <FiIcons.FiLogOut />
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default NavBar;
