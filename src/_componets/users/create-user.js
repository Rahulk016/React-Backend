import React, { Component, Fragment } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { userService } from '../../_services/login/user.service';
import { history } from '../../_helpers/history';

import FromValidator from '../../_validator/formValidator';
import DbOperation from '../../_helpers/dbOperation';

import Breadcrumb from '../../_componets/common/breadcrumb';

import { userTypeService } from '../../_services/masters/usertype.service';
import { withRouter  } from 'react-router-dom';

export class CreateUser extends Component {
    constructor(props) {
        super(props);

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
                field: 'userTypeId',
                method: 'isEmpty',
                validWhen: false,
                message: 'User Type is required'
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
            dbops: DbOperation.create,
            btnText: "Save",
            userTypes: [],
            user: {
                firstName: '',
                lastName: '',
                email: '',
                userTypeId: '',
                password: '',
                confirmPassword: ''
            },
            regSubmitted: false,

            validationReg: this.validatorReg.valid(),
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    passwordMatch = (confirmation, state) => {
        return state.user.password === confirmation;
    };

    componentDidMount() {
        this.getUserTypes();
        debugger;


        if (this.props.location.objRow) {
            this.onEdit(this.props.location.objRow);
        }
    }

    onEdit = (objRow) => {
        this.setState({ btnText: 'Update', dbops: DbOperation.update });
        this.setState({
            user: {
                id: objRow.id,
                firstName: objRow.firstName,
                lastName: objRow.lastName,
                email: objRow.email,
                userTypeId: objRow.userTypeId,
                password: '',
                confirmPassword: ''
            }
        });
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
    clearForm = () => {
        this.setState({
            user: {
                firstName: '',
                lastName: '',
                email: '',
                userTypeId: '',
                password: '',
                confirmPassword: ''
            }
        });
    }


    getUserTypes = () => {
        userTypeService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ userTypes: res.data });
                    } else {
                        toast.error(res.errors[0], "Add User");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Add User");
                }
            )
    };

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { user, dbops } = this.state;

        const validation = this.validatorReg.validate(this.state, 'user');
        this.setState({ validationReg: validation });

        if (validation.isValid) {
            switch (dbops) {
                case DbOperation.create:
                    userService.save(user)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Saved successfully !!", "user Master");
                                    this.clearForm();
                                } else {
                                    toast.error(res.errors[0], "user Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "user Master");
                            }
                        );
                    break;
                case DbOperation.update:
                    userService.update(user)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Updated successfully !!", "user Master");
                                    this.clearForm();
                                } else {
                                    toast.error(res.errors[0], "user Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "user Master");
                            }
                        );
                    break;

            }

        }
    }

    handleCancel = () => {
        history.push('/users/list-user');
    }
    render() {
        const { user, regSubmitted, btnText, userTypes } = this.state;
        let _validatorReg = regSubmitted ? this.validatorReg.validate(this.state, 'user') : this.state.validationReg;

        return (
            <Fragment>
                <Breadcrumb title="user" parent="Masters" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Add User</h5>
                                </div>
                                <div className="card-body">
                                    <form className="form-horizontal auth-form" onSubmit={this.handleSubmit} >
                                        <div className="form-group">
                                            <input name="firstName" type="text"
                                                 className={"form-control " + (_validatorReg.firstName.isInvalid ? "has-error" : "")}
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
                                            <select name="userTypeId"
                                                className={"form-control " + (_validatorReg.userTypeId.isInvalid ? "has-error" : "")}
                                                value={user.userTypeId} onChange={this.handleInputChange}>
                                                <option>--Select User Type--</option>
                                                {userTypes.map((value) => <option key={value.id} value={value.id} >{value.name}</option>)}

                                            </select>
                                            {_validatorReg.userTypeId.isInvalid &&
                                                <div className="help-block" >{_validatorReg.userTypeId.message}</div>
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
                                            <button className="btn btn-primary mr-2" type="submit">{btnText}</button>
                                            <button className="btn btn-danger" onClick={this.handleCancel} type="button">Cancel</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </Fragment>



        )
    }
}

export default withRouter(CreateUser);