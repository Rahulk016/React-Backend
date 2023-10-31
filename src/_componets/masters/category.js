import React, { Component, Fragment } from 'react'

import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { categoryService } from '../../_services/masters/category.service'
import FromValidator from '../../_validator/formValidator';

import DbOperation from '../../_helpers/dbOperation';

import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';

export class Category extends Component {
    constructor(props) {
        super(props);

        this.validatorForm = new FromValidator([
            {
                field: 'name',
                method: 'isEmpty',
                validWhen: false,
                message: 'Name is required'
            },
            {
                field: 'title',
                method: 'isEmpty',
                validWhen: false,
                message: 'Title is required'
            },
            {
                field: 'isSave',
                method: 'isEmpty',
                validWhen: false,
                message: 'Save Value is required'
            },
            {
                field: 'isSave',
                method: 'isNumeric',
                validWhen: true,
                message: 'Save Value must contains only numbers'
            },
            {
                field: 'link',
                method: 'isEmpty',
                validWhen: false,
                message: 'Link is required'
            }
        ]);

        this.state = {
            dbops: DbOperation.create,
            btnText: "Save",
            data: [],
            open: false,
            category: {
                id: 0,
                name: '',
                title:'',
                isSave:'',
                link:'',
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
        const { category } = this.state;
        this.setState({
            category: {
                ...category,
                [name]: value
            }
        });
    }
    clearForm = () => {
        this.setState({
            category: {
                id: 0,
                name: '',
                title:'',
                isSave:'',
                link:'',
                image: ''
            }
        });
    }

    handleSubmit(event) {
        debugger;
        event.preventDefault();
        this.setState({ submitted: true });
        const { category, dbops } = this.state;

        const validation = this.validatorForm.validate(this.state, 'category');
        this.setState({ formValidation: validation });

        if (dbops === DbOperation.create && !category.image) {
            toast.error("Please upload image !!", "Category Master Master");
        }

        if (validation.isValid) {

            let formData = new FormData();
            formData.append("Id", category.id);
            formData.append("Name", category.name);
            formData.append("Title", category.title);
            formData.append("IsSave", category.isSave);
            formData.append("Link", category.link);

            if (category.image) {
                formData.append("Image", category.image, category.image.name);
            }

            switch (dbops) {
                case DbOperation.create:
                    categoryService.save(formData)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Saved successfully !!", "Category Master");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Category Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Category Master");
                            }
                        );
                    break;
                case DbOperation.update:
                    categoryService.update(formData)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Updated successfully !!", "Category Master");
                                    this.getData();
                                    this.clearForm();
                                    this.onCloseModal();
                                } else {
                                    toast.error(res.errors[0], "Category Master");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Category Master");
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
        categoryService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "Category Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Category Master");
                }
            )
    };

    onEdit = (objRow) => {
        this.setState({ open: true, btnText: 'Update' ,dbops : DbOperation.update});
        this.setState({
            category: {
                id: objRow.id,
                name: objRow.name,
                title: objRow.title,
                isSave: objRow.isSave,
                link: objRow.link
            }
        });
    }
    onDelete = (Id) => {
        let obj = {
            id: Id
        };

        categoryService.delete(obj)
            .then(
                res => {
                    if (res.isSuccess) {
                        this.getData();
                        toast.success("Your record has been deleted !!", "Category Master");
                    } else {
                        toast.error(res.errors[0], "Category Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Category Master");
                }
            )

    }

    handleImgChange(e) {
        e.preventDefault();
        let files = e.target.files;

        if (files.length === 0) {
            return;
        }

        let type = files[0].type;
        if (type.match(/image\/*/) == null) {
            toast.error("Only images are supported here !!", "Category Master");
            e.target.value = null;
        }

        const { category } = this.state;
        this.setState({
            category: {
                ...category,
                image: files[0]
            }
        });

    }
    render() {
        const { open, data, btnText, category, submitted } = this.state;
        let _validation = submitted ? this.validatorForm.validate(this.state, 'category') : this.state.formValidation;
        let allColumns = ['name', 'imagePath', 'createdOn'];

        return (
            <Fragment>
                <Breadcrumb title="Category Master" parent="Masters" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Category Master</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <button type="button" className="btn btn-primary" onClick={this.onOpenModal}>Add Category</button>
                                        <Modal open={open} onClose={this.onCloseModal}>
                                            <div className="modal-header">
                                                <h5 className="modal-title f-w-600" id="exampleModalLabel2">Add Category</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={this.handleSubmit} >
                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Name :</label>
                                                        <input type="text" name="name"
                                                            className={"form-control " + (_validation.name.isInvalid ? "has-error" : "")}
                                                            value={category.name} onChange={this.handleInputChange}
                                                        />
                                                        {_validation.name.isInvalid &&
                                                            <div className="help-block" >{_validation.name.message}</div>
                                                        }
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Title :</label>
                                                        <input type="text" name="title"
                                                            className={"form-control " + (_validation.title.isInvalid ? "has-error" : "")}
                                                            value={category.title} onChange={this.handleInputChange}
                                                        />
                                                        {_validation.title.isInvalid &&
                                                            <div className="help-block" >{_validation.title.message}</div>
                                                        }
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Save Value :</label>
                                                        <input type="text" name="isSave"
                                                            className={"form-control " + (_validation.isSave.isInvalid ? "has-error" : "")}
                                                            value={category.isSave} onChange={this.handleInputChange}
                                                        />
                                                        {_validation.isSave.isInvalid &&
                                                            <div className="help-block" >{_validation.isSave.message}</div>
                                                        }
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Link :</label>
                                                        <input type="text" name="link"
                                                            className={"form-control " + (_validation.link.isInvalid ? "has-error" : "")}
                                                            value={category.link} onChange={this.handleInputChange}
                                                        />
                                                        {_validation.link.isInvalid &&
                                                            <div className="help-block" >{_validation.link.message}</div>
                                                        }
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="recipient-name" className="col-form-label" >Category (Image) :</label>
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

export default Category;