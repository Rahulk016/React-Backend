import React, { Component, Fragment } from 'react'

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { colorService } from '../../_services/masters/color.service'
import FromValidator from '../../_validator/formValidator';

import DbOperation from '../../_helpers/dbOperation';

import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';

export class Color extends Component {
    constructor(props) {
        super(props);

        this.validatorForm = new FromValidator([
            {
                field: 'name',
                method: 'isEmpty',
                validWhen: false,
                message: 'Color Name is required'
            },
            {
                field: 'code',
                method: 'isEmpty',
                validWhen: false,
                message: 'Color Code is required'
            }
        ]);

        this.state = {
            dbops: DbOperation.create,
            btnText: "Save",
            data: [],
            open: false,
            color: {
                id: 0,
                name: '',
                code: ''
            },
            submitted: false,
            formValidation: this.validatorForm.valid()
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        const { color } = this.state;
        this.setState({
            color: {
                ...color,
                [name]: value
            }
        });
    }
    clearForm = () => {
        this.setState({
            color: {
                id: 0,
                name: '',
                code: ''
            }
        });
    }

    handleSubmit(event) {
        debugger;
        event.preventDefault();
        this.setState({ submitted: true });
        const { color, dbops } = this.state;

        const validation = this.validatorForm.validate(this.state, 'color');
        this.setState({ formValidation: validation });

        if (validation.isValid) {
            switch (dbops) {
                case DbOperation.create:
                    colorService.save(color)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Saved successfully !!", "Color Master");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Color Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Color Master");
                            }
                        );
                    break;
                case DbOperation.update:
                    colorService.update(color)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Updated successfully !!", "Color Master");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Color Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Color Master");
                            }
                        );
                    break;

            }

        }
    }
    componentDidMount() {
        this.getData();
    }


    onOpenModal = () => {
        this.setState({ open: true, btnText: "Save", dbops: DbOperation.create });
        this.clearForm();
    }
    onCloseModal = () => {
        this.setState({ open: false, btnText: "Save", dbops: DbOperation.create });
        this.clearForm();
    }

    getData = () => {
        colorService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "Color Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Color Master");
                }
            )
    };

    onEdit = (objRow) => {
        this.setState({ open: true, btnText: 'Update', dbops: DbOperation.update });
        this.setState({
            color: {
                id: objRow.id,
                name: objRow.name,
                code: objRow.code
            }
        });
    }
    onDelete = (Id) => {
        let obj = {
            id: Id
        };

        colorService.delete(obj)
            .then(
                res => {
                    if (res.isSuccess) {
                        this.getData();
                        toast.success("Your record has been deleted !!", "Color Master");
                    } else {
                        toast.error(res.errors[0], "Color Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Color Master");
                }
            )

    }
    render() {
        const { open, data, btnText, color, submitted } = this.state;
        let _validation = submitted ? this.validatorForm.validate(this.state, 'color') : this.state.formValidation;
        let allColumns = ['name', 'code', 'createdOn'];

        return (
            <Fragment>
                <Breadcrumb title="Color" parent="Masters" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products Color</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <button type="button" className="btn btn-primary" onClick={this.onOpenModal}>Add Color</button>
                                        <Modal open={open} onClose={this.onCloseModal}>
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Color</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.handleSubmit} >
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Color Name :</label>
                                                        <input type="text" name="name"
                                                            className={"form-control " + (_validation.name.isInvalid ? "has-error" : "")}
                                                            value={color.name} onChange={this.handleInputChange}
                                                        />
                                                        {_validation.name.isInvalid &&
                                                            <div className="help-block" >{_validation.name.message}</div>
                                                        }
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Color Code :</label>
                                                        <input type="text" name="code"
                                                            className={"form-control " + (_validation.code.isInvalid ? "has-error" : "")}
                                                            value={color.code} onChange={this.handleInputChange}
                                                        />
                                                        {_validation.code.isInvalid &&
                                                            <div className="help-block" >{_validation.code.message}</div>
                                                        }
                                                    </div>

                                                    <div className="modal-footer">
                                                        <button type="submit" className="btn btnprimary">{btnText}</button>
                                                        <button type="button" className="btn btnsecondary" onClick={() => this.onCloseModal()} >Close</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </Modal>
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

export default Color;