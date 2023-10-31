import React, { Component, Fragment } from 'react'

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { userService } from '../../_services/login/user.service'

import DbOperation from '../../_helpers/dbOperation';

import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';

import { history } from '../../_helpers/history';


export class ListUser extends Component {
    constructor() {
        super();

        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        userService.getAll()
            .then(
                res => {
                    debugger;
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "User Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "User Master");
                }
            )
    };

    onEdit = (objRow) => {
        history.push({
            pathname: '/users/create-user',
            objRow: objRow
        });
    }
    onDelete = (Id) => {
        let obj = {
            id: Id
        };

        userService.delete(obj)
            .then(
                res => {
                    if (res.isSuccess) {
                        this.getData();
                        toast.success("Your record has been deleted !!", "User Master");
                    } else {
                        toast.error(res.errors[0], "User Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "User Master");
                }
            )
    }

    handleAddUser = () => {
        history.push({
            pathname: '/users/create-user'
        });
    }

    render() {
        const { data } = this.state;
        let allColumns = ['firstName', 'lastName', 'email', 'userType', 'createdOn'];

        return (
            <Fragment>
                <Breadcrumb title="User List" parent="Users" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Users</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <button type="button" className="btn btn-primary" onClick={this.handleAddUser}>Add User</button>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">
                                        <DataTable
                                            myData={data}
                                            showColumns={allColumns}
                                            pagination={true}
                                            editRow={this.onEdit}
                                            deleteRow={this.onDelete}
                                            isAction
                                        />
                                    </div>
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

export default ListUser;