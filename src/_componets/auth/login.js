import React, { Component } from 'react'
import LoginTabSet from './loginTabset';
import {ArrowLeft} from 'react-feather';

export class Login extends Component {
    render() {
        return (
            <div className="page-wrapper">
                <div className="authentication-box">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 p-0 card-right">
                                <div className="card tab2-card">
                                    <div className="card-body">
                                       <LoginTabSet/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a href="#" className="btn btn-primary back-btn"> <ArrowLeft /> back</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;