import React, { Component, Fragment } from 'react'

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { sizeService } from '../../_services/masters/size.service'
import FromValidator from '../../_validator/formValidator';

import DbOperation from '../../_helpers/dbOperation';

import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';

export class Size extends Component {
    constructor(props) {
        super(props);

        this.validatorForm = new FromValidator([
            {
                field: 'name',
                method: 'isEmpty',
                validWhen: false,
                message: 'Size Name is required'
            }
        ]);

        this.state = {
            dbops: DbOperation.create,
            btnText: "Save",
            data: [],
            open: false,
            size: {
                id: 0,
                name: ''
            },
            submitted: false,
            formValidation: this.validatorForm.valid()
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        const { size } = this.state;
        this.setState({
            size: {
                ...size,
                [name]: value
            }
        });
    }
    clearForm = () => {
        this.setState({
            size: {
                id: 0,
                name: ''
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { size,dbops } = this.state;

        const validation = this.validatorForm.validate(this.state, 'size');
        this.setState({ formValidation: validation });

        if (validation.isValid) {
            switch (dbops) {
                case DbOperation.create:
                    sizeService.save(size)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Saved successfully !!", "Size Master");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Size Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Size Master");
                            }
                        );
                    break;
                case DbOperation.update:
                    sizeService.update(size)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Updated successfully !!", "Size Master");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Size Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Size Master");
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
        this.setState({ open: true, btnText: "Save",dbops : DbOperation.create });
        this.clearForm();
    }
    onCloseModal = () => {
        this.setState({ open: false, btnText: "Save" ,dbops : DbOperation.create});
        this.clearForm();
    }

    getData = () => {
        sizeService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "Size Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Size Master");
                }
            )
    };

    onEdit = (objRow) => {
        this.setState({ open: true, btnText: 'Update',dbops : DbOperation.update });
        this.setState({
            size: {
                id: objRow.id,
                name: objRow.name
            }
        });
    }
    onDelete = (Id) => {
        let obj = {
            id: Id
        };

        sizeService.delete(obj)
            .then(
                res => {
                    if (res.isSuccess) {
                        this.getData();
                        toast.success("Your record has been deleted !!", "Size Master");
                    } else {
                        toast.error(res.errors[0], "Size Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Size Master");
                }
            )

    }
    render() {
        const { open, data, btnText, size, submitted } = this.state;
        let _validation = submitted ? this.validatorForm.validate(this.state, 'size') : this.state.formValidation;
        let allColumns = ['name', 'createdOn'];

        return (
            <Fragment>
                <Breadcrumb title="Size" parent="Masters" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products Size</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <button type="button" className="btn btn-primary" onClick={this.onOpenModal}>Add Size</button>
                                        <Modal open={open} onClose={this.onCloseModal}>
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Size</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.handleSubmit} >
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Size Name :</label>
                                                        <input type="text" name="name"
                                                            className={"form-control " + (_validation.name.isInvalid ? "has-error" : "")}
                                                            value={size.name} onChange={this.handleInputChange}
                                                        />
                                                        {_validation.name.isInvalid &&
                                                            <div className="help-block" >{_validation.name.message}</div>
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

export default Size;