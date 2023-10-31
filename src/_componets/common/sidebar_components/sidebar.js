import React, { Component } from 'react'
import User_panel from './user-panel';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/SahosoftMallBachend-logo.png';
import { MENUITEMS } from '../../../_constants/menu';


class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            // mainmenu: MENUITEMS
            mainmenu: []
        };
    }

    componentWillMount() {
        this.setState({ mainmenu: MENUITEMS });
    }


    setNavActive(item) {
        // 
        MENUITEMS.filter(menuItem => {
            if (menuItem != item) {
                menuItem.active = false;
            }

            if (menuItem.children && menuItem.children.includes(item)) {
                menuItem.active = true;
            }

            if (menuItem.children) {
                menuItem.children.filter(subSubItems => {
                    if (subSubItems != item) {
                        subSubItems.active = false;
                    }

                    if (subSubItems.children) {
                        if (subSubItems.children.includes(item)) {
                            subSubItems.active = true;
                            menuItem.active = true;
                        }
                    }
                });
            }
        });
        //

        item.active = !item.active;
        this.setState({ mainmenu: MENUITEMS });
    }


    componentDidMount() {
        var currenturl = window.location.pathname;

        this.state.mainmenu.filter(items => {
            if (!items.children) {
                if (items.path === currenturl) {
                    this.setNavActive(items);
                    return false;
                }
            }

            if (items.children) {
                items.children.filter(subItems => {
                    if (subItems.path === currenturl) {
                        this.setNavActive(subItems);
                    }

                    if (!subItems.children) {
                        return false;
                    }

                    subItems.children.filter(subSubItems => {
                        if (subSubItems.path === currenturl) {
                            this.setNavActive(subSubItems);
                        }
                    });
                });
            }
        });
    }


    render() {
        const mainmenu = this.state.mainmenu.map((menuItem, i) => {
           return  <li className={`${menuItem.active ? 'active' : ''}`} key={i} >

                {(menuItem.type === 'sub') ?
                    <a className="sidebar-header" href="javascript:void(0);" onClick={() => this.setNavActive(menuItem)} >
                        <menuItem.icon />
                        <span>{menuItem.title}</span>
                        <i className="fa fa-angle-right pull-right" ></i>
                    </a>
                    : ''}


                {(menuItem.type === 'link') ?
                    <Link
                        to={`${process.env.PUBLIC_URL}${menuItem.path}`}
                        className={`sidebar-header ${menuItem.active ? 'active' : ''}`}
                        onClick={() => this.setNavActive(menuItem)}
                    >
                        <menuItem.icon />
                        <span>{menuItem.title}</span>
                        {menuItem.children ? <i className="fa fa-angle-right pull-right" ></i> : ''}
                    </Link>
                    : ''}


                {menuItem.children ?
                    <ul className={`sidebar-submenu ${menuItem.active ? 'menu-open' : ''}`} >
                        {menuItem.children.map((childrenItem, index) => {
                            return <li key={index} className={childrenItem.children ? childrenItem.active ? 'active' : '' : ''} >

                                {(childrenItem.type === 'sub') ?
                                    <a href="javascript:void(0);" onClick={() => this.setNavActive(childrenItem)} >
                                        <i className="fa fa-circle" ></i>
                                        <span>{childrenItem.title}</span>
                                        <i className="fa fa-angle-right pull-right" ></i>
                                    </a>
                                    : ''}


                                {(childrenItem.type === 'link') ?
                                    <Link
                                        to={`${process.env.PUBLIC_URL}${childrenItem.path}`}
                                        className={`${childrenItem.active ? 'active' : ''}`}
                                        onClick={() => this.setNavActive(childrenItem)}
                                    >
                                        <i className="fa fa-circle" ></i>
                                        <span>{childrenItem.title}</span>
                                    </Link>
                                    : ''}

                                {childrenItem.children ?
                                    <ul className={`sidebar-submenu ${childrenItem.active ? 'menu-open' : 'active'}`} >
                                        {childrenItem.children.map((childrenSubItem, index) => {
                                            return <li key={index} className={childrenSubItem.active ? 'active' : ''} >

                                                {(childrenSubItem.type === 'link') ?
                                                    <Link
                                                        to={`${process.env.PUBLIC_URL}${childrenSubItem.path}`}
                                                        className={`${childrenSubItem.active ? 'active' : ''}`}
                                                        onClick={() => this.setNavActive(childrenSubItem)}
                                                    >
                                                        <i className="fa fa-circle" ></i>
                                                        <span>{childrenSubItem.title}</span>
                                                    </Link>
                                                    : ''}
                                            </li>
                                        }
                                        )}
                                    </ul>
                                    : ''
                                }
                            </li>
                        })}
                    </ul>
                    : ''
                }

            </li>
        });


        return (
            <div className="page-sidebar">
                <div className="main-header-left d-none d-lg-block">
                    <div className="logo-wrapper">
                        <img className="blur-up lazyloaded" alt="logo icon" src={logo} />
                    </div>
                </div>
                <div className="sidebar custom-scrollbar">
                    <User_panel />
                    <ul className="sidebar-menu">
                        {mainmenu}
                    </ul>
                </div>
            </div>
        )
    }
}


export default Sidebar;