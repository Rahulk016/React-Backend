import React, { Component, Fragment } from 'react'

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { tagService } from '../../_services/masters/tag.service'
import FromValidator from '../../_validator/formValidator';

import DbOperation from '../../_helpers/dbOperation';

import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';

export class Tag extends Component {
    constructor(props) {
        super(props);

        this.validatorForm = new FromValidator([
            {
                field: 'name',
                method: 'isEmpty',
                validWhen: false,
                message: 'Tag Name is required'
            }
        ]);

        this.state = {
            dbops: DbOperation.create,
            btnText: "Save",
            data: [],
            open: false,
            tag: {
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
        const { tag } = this.state;
        this.setState({
            tag: {
                ...tag,
                [name]: value
            }
        });
    }
    clearForm = () => {
        this.setState({
            tag: {
                id: 0,
                name: ''
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { tag,dbops } = this.state;

        const validation = this.validatorForm.validate(this.state, 'tag');
        this.setState({ formValidation: validation });

        if (validation.isValid) {
            switch (dbops) {
                case DbOperation.create:
                    tagService.save(tag)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Saved successfully !!", "Tag Master");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Tag Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Tag Master");
                            }
                        );
                    break;
                case DbOperation.update:
                    tagService.update(tag)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Updated successfully !!", "Tag Master");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Tag Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Tag Master");
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
        this.setState({ open: false, btnText: "Save",dbops : DbOperation.create });
        this.clearForm();
    }

    getData = () => {
        tagService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "Tag Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Tag Master");
                }
            )
    };

    onEdit = (objRow) => {
        this.setState({ open: true, btnText: 'Update',dbops : DbOperation.update });
        this.setState({
            tag: {
                id: objRow.id,
                name: objRow.name
            }
        });
    }
    onDelete = (Id) => {
        let obj = {
            id: Id
        };

        tagService.delete(obj)
            .then(
                res => {
                    if (res.isSuccess) {
                        this.getData();
                        toast.success("Your record has been deleted !!", "Tag Master");
                    } else {
                        toast.error(res.errors[0], "Tag Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Tag Master");
                }
            )

    }
    render() {
        const { open, data, btnText, tag, submitted } = this.state;
        let _validation = submitted ? this.validatorForm.validate(this.state, 'tag') : this.state.formValidation;
        let allColumns = ['name', 'createdOn'];

        return (
            <Fragment>
                <Breadcrumb title="Tag" parent="Masters" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products Tag</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <button type="button" className="btn btn-primary" onClick={this.onOpenModal}>Add Tag</button>
                                        <Modal open={open} onClose={this.onCloseModal}>
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Tag</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.handleSubmit} >
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Tag Name :</label>
                                                        <input type="text" name="name"
                                                            className={"form-control " + (_validation.name.isInvalid ? "has-error" : "")}
                                                            value={tag.name} onChange={this.handleInputChange}
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

export default Tag;