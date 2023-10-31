import React, { Component, Fragment } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { User, Unlock } from 'react-feather';

import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { userService } from '../../_services/login/user.service';
import { history } from '../../_helpers/history';

import { connect } from 'react-redux';
import { changeloggedIn } from '../../_actions/user.actions';

import FromValidator from '../../_validator/formValidator';

class LoginTabSet extends Component {
    constructor(props) {
        super(props);

        this.validatorLogin = new FromValidator([
            {
                field: 'userName',
                method: 'isEmpty',
                validWhen: false,
                message: 'Username is required'
            },
            {
                field: 'userName',
                method: 'isEmail',
                validWhen: true,
                message: 'Enter valid Username'
            },
            {
                field: 'password',
                method: 'isEmpty',
                validWhen: false,
                message: 'password is required'
            }
        ]);

        this.validatorReg = new FromValidator([
            {
                field: 'firstName',
                method: 'isEmpty',
                validWhen: false,
                message: 'firstName is required'
            },
            {
                field: 'lastName',
                method: 'isEmpty',
                validWhen: false,
                message: 'lastName is required'
            },
            {
                field: 'email',
                method: 'isEmpty',
                validWhen: false,
                message: 'email is required'
            },
            {
                field: 'email',
                method: 'isEmail',
                validWhen: true,
                message: 'Enter valid email address'
            },
            {
                field: 'password',
                method: 'isEmpty',
                validWhen: false,
                message: 'password is required'
            },
            {
                field: 'confirmPassword',
                method: 'isEmpty',
                validWhen: false,
                message: 'Confirm Password is required'
            },
            {
                field: 'confirmPassword',
                method: this.passwordMatch,
                validWhen: true,
                message: 'Password and Confirm Password do not match'
            }
        ]);

        this.state = {
            tabIndex: 0,

            userName: '',
            password: '',
            loginSubmitted: false,

            user: {
                firstName: '',
                lastName: '',
                email: '',
                userTypeId: 1,
                password: '',
                confirmPassword: ''
            },
            regSubmitted: false,

            validationLogin: this.validatorLogin.valid(),
            validationReg: this.validatorReg.valid(),
        };

        this.doLogin = this.doLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.logout();
    }

    passwordMatch = (confirmation, state) => {
        return state.user.password === confirmation;
    };

    tabChange(index) {
        this.setState({ tabIndex: index });
    }

    handleChange(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({ [name]: value });
        // this.setState({
        //     [event.target.name]: event.target.value
        // });
    }

    async doLogin(event) {
        event.preventDefault();
        const validation = this.validatorLogin.validate(this.state, '');
        this.setState({ validationLogin: validation });

        this.setState({ loginSubmitted: true });

        const { userName, password } = this.state;

        if (validation.isValid) {
            userService.login(userName, password)
                .then(
                    res => {
                        if (res.isSuccess) {
                            if (res.data.id === 0) {
                                toast.error("Please enter valid username and password !!", "Login");
                                localStorage.removeItem("userDetails");
                                this.clearLoginForm();
                            } else {
                                localStorage.setItem("userDetails", JSON.stringify(res.data));
                                this.props.setLoggedIn(true, res.data);
                                this.clearLoginForm();
                                history.push('/dashboard');
                            }
                        } else {
                            localStorage.removeItem("userDetails");
                            toast.error("Invalid Credetials !!", "Login");
                            this.clearLoginForm();
                        }
                    }, error => {
                        localStorage.removeItem("userDetails");
                        toast.error("Invalid Credetials !!", "Login");
                        this.clearLoginForm();
                    }
                )
        }
    }

    clearLoginForm = () => {
        this.setState({
            userName: '',
            password: ''
        });
    }

    logout() {
        localStorage.clear();
        this.props.setLoggedIn(false, {});
    }
    handleInputChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }
    clearRegForm = () => {
        this.setState({
            user: {
                firstName: '',
                lastName: '',
                email: '',
                userTypeId: 1,
                password: '',
                confirmPassword: ''
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ regSubmitted: true });
        const { user } = this.state;

        const validation = this.validatorReg.validate(this.state, 'user');
        this.setState({ validationReg: validation });

        if (validation.isValid) {
            userService.register(user)
                .then(
                    res => {
                        if (res.isSuccess) {
                            toast.success("Registration has been done successfully !!", "Registration");
                            this.clearRegForm();
                            this.setState({ tabIndex: 0 });
                        } else {
                            toast.error(res.errors[0], "Registration");
                        }
                    },
                    error => {
                        toast.error("Something went wrong", "Registration");
                    }
                )
        }
    }

    render() {
        const { userName, password, loginSubmitted, user, regSubmitted } = this.state;
        let _validatorReg = regSubmitted ? this.validatorReg.validate(this.state, 'user') : this.state.validationReg;
        let _validatorLogin = loginSubmitted ? this.validatorLogin.validate(this.state, '') : this.state.validationLogin;

        return (
            <div>
                <Fragment>
                    <Tabs selectedIndex={this.state.tabIndex} onSelect={(tabIndex) => this.tabChange(tabIndex)} >
                        <TabList className="nav nav-tabs tab-coupon" >
                            <Tab className="nav-link" ><Unlock /> Login</Tab>
                            <Tab className="nav-link"><User /> Register</Tab>
                        </TabList>

                        <TabPanel>
                            <form className="form-horizontal auth-form" onSubmit={this.doLogin} >
                                <div className='form-group'>
                                    <input name="userName" type="email"
                                        className={"form-control " + (_validatorLogin.userName.isInvalid ? "has-error" : "")}
                                        placeholder="Username" value={userName} onChange={this.handleChange} />
                                    {_validatorLogin.userName.isInvalid &&
                                        <div className="help-block" >{_validatorLogin.userName.message}</div>
                                    }
                                </div>
                                <div className='form-group'>
                                    <input name="password" type="password"
                                        className={"form-control " + (_validatorLogin.password.isInvalid ? "has-error" : "")}
                                        placeholder="Password" value={password} onChange={this.handleChange} />
                                    {_validatorLogin.password.isInvalid &&
                                        <div className="help-block" >{_validatorLogin.password.message}</div>
                                    }
                                </div>
                                <div className="form-button">
                                    <button className="btn btn-primary" type="submit" >Login</button>
                                </div>
                            </form>
                        </TabPanel>

                        <TabPanel>
                            <form className="form-horizontal auth-form" onSubmit={this.handleSubmit} >
                                <div className="form-group">
                                    <input name="firstName" type="text"
                                        className="form-control"
                                        placeholder="First Name" value={user.firstName} onChange={this.handleInputChange} />
                                    {_validatorReg.firstName.isInvalid &&
                                        <div className="help-block" >{_validatorReg.firstName.message}</div>
                                    }
                                </div>
                                <div className="form-group">
                                    <input name="lastName" type="text"
                                        className={"form-control " + (_validatorReg.lastName.isInvalid ? "has-error" : "")}
                                        placeholder="Last Name" value={user.lastName} onChange={this.handleInputChange} />
                                    {_validatorReg.lastName.isInvalid &&
                                        <div className="help-block" >{_validatorReg.lastName.message}</div>
                                    }
                                </div>
                                <div className="form-group">
                                    <input name="email" type="email"
                                        className={"form-control " + (_validatorReg.email.isInvalid ? "has-error" : "")}
                                        placeholder="Email" value={user.email} onChange={this.handleInputChange} />
                                    {_validatorReg.email.isInvalid &&
                                        <div className="help-block" >{_validatorReg.email.message}</div>
                                    }
                                </div>
                                <div className="form-group">
                                    <input required="" name="password" type="password"
                                        className={"form-control " + (_validatorReg.password.isInvalid ? "has-error" : "")}
                                        placeholder="Password" value={user.password} onChange={this.handleInputChange} />
                                    {_validatorReg.password.isInvalid &&
                                        <div className="help-block" >{_validatorReg.password.message}</div>
                                    }
                                </div>
                                <div className="form-group">
                                    <input name="confirmPassword" type="password"
                                        className={"form-control " + (_validatorReg.confirmPassword.isInvalid ? "has-error" : "")}
                                        placeholder="Confirm Password" value={user.confirmPassword} onChange={this.handleInputChange} />
                                    {_validatorReg.confirmPassword.isInvalid &&
                                        <div className="help-block" >{_validatorReg.confirmPassword.message}</div>
                                    }
                                </div>
                                <div className="form-button">
                                    <button className="btn btn-primary" type="submit">Register</button>
                                </div>
                            </form>
                        </TabPanel>
                    </Tabs>
                </Fragment>
                <ToastContainer />
            </div>
        )
    }
}

const mapStoreToProps = (state) => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLoggedIn: (isLoggedIn, user) => {
            dispatch(changeloggedIn(isLoggedIn, user))
        }
    }
};

export default connect(mapStoreToProps, mapDispatchToProps)(withRouter(LoginTabSet));