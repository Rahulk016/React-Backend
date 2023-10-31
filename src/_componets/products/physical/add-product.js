import React, { Component, Fragment } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { productService } from '../../../_services/products/product.service';
import { history } from '../../../_helpers/history';

import FromValidator from '../../../_validator/formValidator';
import DbOperation from '../../../_helpers/dbOperation';

import Breadcrumb from '../../../_componets/common/breadcrumb';

import { categoryService } from '../../../_services/masters/category.service';
import { colorService } from '../../../_services/masters/color.service';
import { sizeService } from '../../../_services/masters/size.service';
import { tagService } from '../../../_services/masters/tag.service';

import { withRouter } from 'react-router-dom';

import productImg from '../../../assets/images/user.png';

import Global from '../../../_helpers/global';
import bigImage from '../../../assets/images/bigImage.jpg'

import CKEditor from "react-ckeditor-component";

export class AddProduct extends Component {

    constructor() {
        super();
        this.validatorReg = new FromValidator([
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
                field: 'code',
                method: 'isEmpty',
                validWhen: false,
                message: 'Code is required'
            },
            {
                field: 'price',
                method: 'isEmpty',
                validWhen: false,
                message: 'Price is required'
            },
            {
                field: 'salePrice',
                method: 'isEmpty',
                validWhen: false,
                message: 'Sale Price is required'
            },
            {
                field: 'discount',
                method: 'isEmpty',
                validWhen: false,
                message: 'Discount is required'
            },
            {
                field: 'sizeId',
                method: 'isEmpty',
                validWhen: false,
                message: 'Size is required'
            },
            {
                field: 'categoryId',
                method: 'isEmpty',
                validWhen: false,
                message: 'Category is required'
            },
            {
                field: 'tagId',
                method: 'isEmpty',
                validWhen: false,
                message: 'Tag is required'
            },
            {
                field: 'colorId',
                method: 'isEmpty',
                validWhen: false,
                message: 'Color is required'
            }
        ]);

        this.state = {
            dummyimgs: [
                { img: productImg },
                { img: productImg },
                { img: productImg },
                { img: productImg },
                { img: productImg },
            ],
            dbops: DbOperation.create,
            btnText: "Save",
            product: {
                id: 0,
                name: '',
                title: '',
                code: '',
                price: '',
                salePrice: '',
                discount: '',
                quantity: 1,
                sizeId: '',
                categoryId: '',
                colorId: '',
                tagId: '',
                isSale: false,
                isNew: false,
                shortDetails: '',
                description: '',
                image: []
            },
            objSizes: [],
            objCategories: [],
            objTags: [],
            objColors: [],
            regSubmitted: false,
            validationReg: this.validatorReg.valid(),
        };

        this.fileTobeUpload = [];

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        this.getCategories();
        this.getColors();
        this.getSizes();
        this.getTags();
        if (this.props.location.productId) {
            this.onEdit(this.props.location.productId);
        }
    }

    onEdit = (productId) => {
        productService.getById(productId)
            .then(
                res => {
                    if (res.isSuccess) {
                        let objRow = res.data;
                        this.setState({
                            btnText: 'Update',
                            dbops: DbOperation.update,
                            product: {
                                id: objRow.id,
                                name: objRow.name,
                                title: objRow.title,
                                code: objRow.code,
                                price: objRow.price,
                                salePrice: objRow.salePrice,
                                discount: objRow.discount,
                                quantity: objRow.quantity,
                                sizeId: objRow.sizeId,
                                categoryId: objRow.categoryId,
                                colorId: objRow.colorId,
                                tagId: objRow.tagId,
                                isSale: objRow.isSale === 1 ? true : false,
                                isNew: objRow.isNew === 1 ? true : false,
                                shortDetails: objRow.shortDetails,
                                description: objRow.description,
                                image: []
                            }
                        });
                        this.getPictures(objRow.id);
                    } else {
                        toast.error(res.errors[0], "Add Product");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Add Product");
                }
            )


    }

    getPictures = (id) => {
        productService.GetProductPicturebyId(id)
            .then(
                res => {
                    if (res.isSuccess) {
                        if (res.data.length > 0) {
                            debugger;
                            this.setState({
                                dummyimgs: [
                                    { img: res.data[0] != null ? Global.BASE_IMAGES_PATH + res.data[0].name : productImg },
                                    { img: res.data[1] != null ? Global.BASE_IMAGES_PATH + res.data[1].name : productImg },
                                    { img: res.data[2] != null ? Global.BASE_IMAGES_PATH + res.data[2].name : productImg },
                                    { img: res.data[3] != null ? Global.BASE_IMAGES_PATH + res.data[3].name : productImg },
                                    { img: res.data[4] != null ? Global.BASE_IMAGES_PATH + res.data[4].name : productImg }
                                ]
                            });
                        }
                    } else {
                        toast.error(res.errors[0], "Add Product");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Add Product");
                }
            )
    };

    handleInputChange(event) {
        const { name, value, type, checked } = event.target;
        const { product } = this.state;

        type === "checkbox" ?
            this.setState({
                product: {
                    ...product,
                    [name]: checked
                }
            })
            : this.setState({
                product: {
                    ...product,
                    [name]: value
                }
            })
    }

    onChangeCkEdtior = (evt) => {
        const { product } = this.state;
        var newContent = evt.editor.getData();
        this.setState({
            product: {
                ...product,
                description: newContent
            }
        })
    }


    clearForm = () => {
        this.setState({
            dummyimgs: [
                { img: productImg },
                { img: productImg },
                { img: productImg },
                { img: productImg },
                { img: productImg },
            ],
            dbops: DbOperation.create,
            btnText: "Save",
            product: {
                id: 0,
                name: '',
                title: '',
                code: '',
                price: '',
                salePrice: '',
                discount: '',
                quantity: 1,
                sizeId: '',
                categoryId: '',
                colorId: '',
                tagId: '',
                isSale: false,
                isNew: false,
                shortDetails: '',
                description: '',
                image: []
            },
            objSizes: [],
            objCategories: [],
            objTags: [],
            objColors: [],
            regSubmitted: false,
            validationReg: this.validatorReg.valid(),
        });
    }
    getColors = () => {
        colorService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ objColors: res.data });
                    } else {
                        toast.error(res.errors[0], "Add Product");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Add Product");
                }
            )
    };
    getCategories = () => {
        categoryService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ objCategories: res.data });
                    } else {
                        toast.error(res.errors[0], "Add Product");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Add Product");
                }
            )
    };
    getTags = () => {
        tagService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ objTags: res.data });
                    } else {
                        toast.error(res.errors[0], "Add Product");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Add Product");
                }
            )
    };
    getSizes = () => {
        sizeService.getAll()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ objSizes: res.data });
                    } else {
                        toast.error(res.errors[0], "Add Product");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Add Product");
                }
            )
    };
    IncrementItem = () => {
        const { product } = this.state;
        this.setState({
            product: {
                ...product,
                quantity: product.quantity + 1
            }
        });
    }
    DecrementItem = () => {
        const { product } = this.state;
        if(product.quantity >1){
        this.setState({
            product: {
                ...product,
                quantity: product.quantity - 1
            }
        });
    }
    }
    handleImgChange(e, i) {
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
            return;
        }

        this.fileTobeUpload[i] = e.target.files[0];

        let reader = new FileReader();
        let file = e.target.files[0];
        const { dummyimgs } = this.state;

        reader.onloadend = () => {
            dummyimgs[i].img = reader.result;
            this.setState({
                dummyimgs
            });
        }

      
        reader.readAsDataURL(file);
    }
    handleSubmit(event) {
        event.preventDefault();
        this.setState({ regSubmitted: true });
        const { product, dbops } = this.state;

        if (dbops === DbOperation.create && this.fileTobeUpload.length < 5) {
            toast.error("Please upload 5 images per product !!", "Add Product");
        }

        const validation = this.validatorReg.validate(this.state, 'product');
        this.setState({ validationReg: validation });

        if (validation.isValid) {

            let formData = new FormData();
            formData.append("Id", product.id);
            formData.append("Name", product.name);
            formData.append("Title", product.title);
            formData.append("Code", product.code);
            formData.append("Price", product.price);
            formData.append("SalePrice", product.salePrice);
            formData.append("Discount", product.discount);
            formData.append("CategoryId", product.categoryId);
            formData.append("TagId", product.tagId);
            formData.append("ColorId", product.colorId);
            formData.append("SizeId", product.sizeId);
            formData.append("Quantity", product.quantity);
            formData.append("IsSale", product.isSale);
            formData.append("IsNew", product.isNew);
            formData.append("ShortDetails", product.shortDetails);
            formData.append("Description", product.description);


            if (product.image) {
                if (this.fileTobeUpload) {
                    for (let i = 0; i < this.fileTobeUpload.length; i++) {
                        let ToUpload = this.fileTobeUpload[i];
                        formData.append("Image", ToUpload, ToUpload.name);
                    }
                }
            }

            switch (dbops) {
                case DbOperation.create:
                    productService.save(formData)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Saved successfully !!", "Add Product");
                                    this.clearForm();
                                } else {
                                    toast.error(res.errors[0], "Add Product");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Add Product");
                            }
                        );
                    break;
                case DbOperation.update:
                    productService.update(formData)
                        .then(
                            res => {
                                if (res.isSuccess) {
                                    toast.success("Data Updated successfully !!", "Add Product");
                                    this.clearForm();
                                } else {
                                    toast.error(res.errors[0], "Add Product");
                                }
                            },
                            error => {
                                toast.error("Something went wrong", "Add Product");
                            }
                        );
                    break;

            }

        }
    }

    handleCancel = () => {
        history.push('/products/physical/product-list');
    }
    render() {
        const { product, regSubmitted, btnText, objCategories, objColors, objSizes, objTags } = this.state;
        let _validatorReg = regSubmitted ? this.validatorReg.validate(this.state, 'product') : this.state.validationReg;
        return (
            <Fragment>
                <Breadcrumb title="Add Product" parent="Products" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Add Product</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row product-adding">
                                        <div className="col-xl-5">
                                            <div className="add-product">
                                                <div className="row">
                                                    <div className="col-xl-9 xl-50 col-sm-6 col-9">
                                                        <img src={bigImage} alt="product banner" className="img-fluid image_zoom_1 blur-up lazyloaded"
                                                        />
                                                    </div>
                                                    <div className="col-xl-3 xl-50 col-sm-6 col-3">
                                                        <ul className="file-upload-product">
                                                            {
                                                                this.state.dummyimgs.map((res, i) => {
                                                                    return (
                                                                        <li key={i} >
                                                                            <div className="box-input-file" >
                                                                                <input className="upload" type="file" onChange={(e) => this.handleImgChange(e, i)} />
                                                                                <img src={res.img} alt="product image" style={{ width: 50, height: 50 }} />
                                                                            </div>
                                                                        </li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-7">
                                            <form className="needs-validation add-product-form" onSubmit={this.handleSubmit} >
                                                <div className="form form-label-center">
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Name :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <input type="text"
                                                                className={"form-control " + (_validatorReg.name.isInvalid ? "has-error" : "")}
                                                                name="name" type="text" value={product.name}
                                                                onChange={this.handleInputChange} />
                                                            {_validatorReg.name.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.name.message}</div>
                                                            }

                                                        </div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Title :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <input type="text"
                                                                className={"form-control " + (_validatorReg.title.isInvalid ? "has-error" : "")} name="title"
                                                                type="text" value={product.title}
                                                                onChange={this.handleInputChange} />
                                                            {_validatorReg.title.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.title.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Code :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <input type="text" className={"form-control " + (_validatorReg.code.isInvalid ? "has-error" : "")}
                                                                name="code"
                                                                type="text" value={product.code}
                                                                onChange={this.handleInputChange} />
                                                            {_validatorReg.code.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.code.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Price :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <input type="text" className={"form-control " + (_validatorReg.price.isInvalid ? "has-error" : "")}
                                                                name="price"
                                                                type="number" value={product.price}
                                                                onChange={this.handleInputChange} />
                                                            {_validatorReg.price.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.price.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Sale Price :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <input type="text" className={"form-control " + (_validatorReg.salePrice.isInvalid ? "has-error" : "")}
                                                                name="salePrice" type="number" value={product.salePrice}
                                                                onChange={this.handleInputChange} />
                                                            {_validatorReg.salePrice.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.salePrice.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group mb-3 row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Discount :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <input type="text" className={"form-control " + (_validatorReg.discount.isInvalid ? "has-error" : "")}
                                                                name="discount" type="number" value={product.discount}
                                                                onChange={this.handleInputChange} />
                                                            {_validatorReg.discount.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.discount.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form">
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" >Size :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <select className={"form-control " + (_validatorReg.sizeId.isInvalid ? "has-error" : "")}
                                                                name="sizeId"
                                                                value={product.sizeId} onChange={this.handleInputChange}>
                                                                <option>--Select Size--</option>
                                                                {objSizes.map((value) => <option key={value.id} value={value.id} >{value.name}</option>)}

                                                            </select>
                                                            {_validatorReg.sizeId.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.sizeId.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" >Categories :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                        <select className={"form-control " + (_validatorReg.categoryId.isInvalid ? "has-error" : "")}
                                                                name="categoryId" value={product.categoryId} onChange={this.handleInputChange}>
                                                                <option>--Select Category--</option>
                                                                {objCategories.map((value) => <option key={value.id} value={value.id} >{value.name}</option>)}

                                                            </select>
                                                            {_validatorReg.categoryId.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.categoryId.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" >Tag :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <select className={"form-control " + (_validatorReg.tagId.isInvalid ? "has-error" : "")}
                                                                name="tagId" value={product.tagId} onChange={this.handleInputChange}>
                                                                <option>--Select Tag--</option>
                                                                {objTags.map((value) => <option key={value.id} value={value.id} >{value.name}</option>)}

                                                            </select>
                                                            {_validatorReg.tagId.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.tagId.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0" >Color :</label>
                                                        <div className="col-xl-8 col-sm-7">
                                                            <select className={"form-control " + (_validatorReg.colorId.isInvalid ? "has-error" : "")}
                                                                name="colorId" value={product.colorId} onChange={this.handleInputChange}>
                                                                <option>--Select Color--</option>
                                                                {objColors.map((value) => <option key={value.id} value={value.id} >{value.name}</option>)}

                                                            </select>
                                                            {_validatorReg.colorId.isInvalid &&
                                                                <div className="help-block" >{_validatorReg.colorId.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4 mb-0">Total Products :</label>
                                                        <fieldset className="qty-box ml-0">
                                                            <div className="input-group bootstrap-touchspin">
                                                                <div className="input-group-prepend">
                                                                    <button className="btn btn-primary btn-square bootstraptouchspin-down" type="button"
                                                                        onClick={this.DecrementItem} >
                                                                        <i className="fa fa-minus"></i>
                                                                    </button>
                                                                </div>
                                                                <div className="input-group-prepend">
                                                                    <span className="input-group-text bootstrap-touchspinprefix" ></span>
                                                                </div>
                                                                <input className="touchspin form-control qtyheight" type="text" disabled value={product.quantity} />
                                                                <div className="input-group-append">
                                                                    <span className="input-group-text bootstrap-touchspinpostfix"></span>
                                                                </div>
                                                                <div className="input-group-append ml-0">
                                                                    <button className="btn btn-primary btn-square bootstraptouchspin-up" type="button"
                                                                        onClick={this.IncrementItem} >
                                                                        <i className="fa fa-plus"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label for="validationCustom0" class="col-xl-3 colmd-4">IsSale
 :</label>
                                                        <div class="col-xl-8 col-md-7">
                                                            <input name="isSale" id="checkbox-primary-2" type="checkbox"
                                                                checked={product.isSale} onChange={this.handleInputChange} />
                                                            <label for="checkbox-primary-2">Select for mark this product for
 Sale</label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label for="validationCustom0" class="col-xl-3 colmd-4">IsNew
 :</label>
                                                        <div class="col-xl-8 col-md-7">
                                                            <input name="isNew" id="checkbox-primary-3" type="checkbox"
                                                                checked={product.isNew} onChange={this.handleInputChange} />
                                                            <label for="checkbox-primary-3">Select for mark this product for
New</label>
                                                        </div>
                                                    </div>
                                                    <div class="form-group row">
                                                        <label for="validationCustom0" class="col-xl-3 col-md4"><span>*</span>Short
 Details</label>
                                                        <textarea rows="5" cols="12" class="form-control col-xl-8 col-md-7"
                                                            name="shortDetails" value={product.shortDetails} onChange={this.handleInputChange} ></textarea>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-sm-4">Add Description :</label>
                                                        <div className="col-xl-8 col-sm-7 description-sm">
                                                            <CKEditor
                                                                activeClass="p10"
                                                                content={product.description}
                                                                events={{
                                                                    "change": this.onChangeCkEdtior
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="offset-xl-3 offset-sm-4">
                                                    <button type="submit" className="btn btn-primary">{btnText}</button>
                                                    <button type="button" className="btn btn-light">Discard</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </Fragment>
        )
    }
}

export default withRouter(AddProduct);