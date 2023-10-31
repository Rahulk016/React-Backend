import React, { Component, Fragment } from 'react'

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { brandLogoService } from '../../_services/masters/brandlogo.service'
import FromValidator from '../../_validator/formValidator';

import DbOperation from '../../_helpers/dbOperation';

import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';

export class BrandLogo extends Component {
    constructor(props) {
        super(props);

        this.validatorForm = new FromValidator([
            {
                field: 'name',
                method: 'isEmpty',
                validWhen: false,
                message: 'BrandLogo Name is required'
            }
        ]);

        this.state = {
            dbops: DbOperation.create,
            btnText: "Save",
            data: [],
            open: false,
            brandlogo: {
                id: 0,
                name: '',
                image: ''
            },
            submitted: false,
            formValidation: this.validatorForm.valid()
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleImgChange = this.handleImgChange.bind(this);
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        const { brandlogo } = this.state;
        this.setState({
            brandlogo: {
                ...brandlogo,
                [name]: value
            }
        });
    }
    clearForm = () => {
        this.setState({
            brandlogo: {
                id: 0,
                name: '',
                image: ''
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ submitted: true });
        const { brandlogo, dbops } = this.state;

        const validation = this.validatorForm.validate(this.state, 'brandlogo');
        this.setState({ formValidation: validation });

        if (dbops === DbOperation.create && !brandlogo.image) {
            toast.error("Please upload image !!", "Brand Logo Master");
        }

        if (validation.isValid) {

            let formData = new FormData();
            formData.append("Id", brandlogo.id);
            formData.append("Name", brandlogo.name);

            if (brandlogo.image) {
                formData.append("Image", brandlogo.image, brandlogo.image.name);
            }

            switch (dbops) {
                case DbOperation.create:
                    brandLogoService.save(formData)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Saved successfully !!", "Brand Logo");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Brand Logo");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Brand Logo");
                            }
                        );
                    break;
                case DbOperation.update:
                    brandLogoService.update(formData)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Updated successfully !!", "Brand Logo");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Brand Logo");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Brand Logo");
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
        this.setState({ open: false, btnText: "Save",dbops: DbOperation.create });
        this.clearForm();
    }

    getData = () => {
        brandLogoService.getAll()
            .then(
                res => {
                    debugger;
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "Brand Logo");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Brand Logo");
                }
            )
    };

    onEdit = (objRow) => {
        this.setState({ open: true, btnText: 'Update' ,dbops : DbOperation.update});
        this.setState({
            brandlogo: {
                id: objRow.id,
                name: objRow.name
            }
        });
    }
    onDelete = (Id) => {
        let obj = {
            id: Id
        };

        brandLogoService.delete(obj)
            .then(
                res => {
                    if (res.isSuccess) {
                        this.getData();
                        toast.success("Your record has been deleted !!", "Brand Logo");
                    } else {
                        toast.error(res.errors[0], "Brand Logo");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Brand Logo");
                }
            )

    }

    handleImgChange(e) {
        debugger;
        e.preventDefault();
        let files = e.target.files;

        if (files.length === 0) {
            return;
        }

        let type = files[0].type;
        if (type.match(/image\/*/) == null) {
            toast.error("Only images are supported here !!", "Brand Logo");
            e.target.value = null;
        }

        const { brandlogo } = this.state;
        this.setState({
            brandlogo: {
                ...brandlogo,
                image: files[0]
            }
        });

    }
    render() {
        const { open, data, btnText, brandlogo, submitted } = this.state;
        let _validation = submitted ? this.validatorForm.validate(this.state, 'brandlogo') : this.state.formValidation;
        let allColumns = ['name', 'imagePath', 'createdOn'];

        return (
            <Fragment>
                <Breadcrumb title="BrandLogo" parent="Masters" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Products BrandLogo</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <button type="button" className="btn btn-primary" onClick={this.onOpenModal}>Add BrandLogo</button>
                                        <Modal open={open} onClose={this.onCloseModal}>
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add BrandLogo</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.handleSubmit} >
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >BrandLogo Name :</label>
                                                        <input type="text" name="name"
                                                            className={"form-control " + (_validation.name.isInvalid ? "has-error" : "")}
                                                            value={brandlogo.name} onChange={this.handleInputChange}
                                                        />
                                                        {_validation.name.isInvalid &&
                                                            <div className="help-block" >{_validation.name.message}</div>
                                                        }
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >BrandLogo (Image) :</label>
                                                        <input type="file" name="image"
                                                            className="form-control"
                                                            onChange={this.handleImgChange}
                                                        />

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

export default BrandLogo;