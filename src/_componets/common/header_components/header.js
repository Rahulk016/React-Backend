import React, { Component } from 'react'
import User_menu from './user-menu';
import logo from '../../../assets/images/SahosoftMallBachend-logo.png';
import { AlignLeft } from 'react-feather';

export class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sidebar: true
        }
    }

    openCloseSidebar = () => {
        if (this.state.sidebar) {
            this.setState({ sidebar: false });
            document.querySelector(".page-main-header").classList.add('open');
            document.querySelector(".page-sidebar").classList.add('open');
        } else {
            this.setState({ sidebar: true });
            document.querySelector(".page-main-header").classList.remove('open');
            document.querySelector(".page-sidebar").classList.remove('open');
        }
    }

    render() {
        return (
            <div className="page-main-header ">
                <div className="main-header-right row">
                    <div className="main-header-left d-lg-none" >
                        <div className="logo-wrapper">
                            <a href="#">
                                <img className="blur-up lazyloaded" alt="logo image" src={logo} />
                            </a>
                        </div>
                    </div>
                    <div className="mobile-sidebar">
                        <div className="media-body text-right switch-sm">
                            <label className="switch"><a onClick={this.openCloseSidebar} ><AlignLeft /></a></label>
                        </div>
                    </div>
                    <div className="nav-right col">
                        <ul className="nav-menus open">
                            <li>
                                <User_menu />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;