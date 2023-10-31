import React, { Component, Fragment } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { productService } from '../../../_services/products/product.service'

import Breadcrumb from '../../../_componets/common/breadcrumb';
import DataTable from '../../common/datatable';

import { history } from '../../../_helpers/history';


export class ProductList extends Component {
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
        productService.getAll()
            .then(
                res => {
                    debugger;
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "Product Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Product Master");
                }
            )
    };

    onEdit = (objRow) => {
        history.push({
            pathname: '/products/physical/add-product',
            productId: objRow.id
        });
    }
    onDelete = (Id) => {
        let obj = {
            id: Id
        };

        productService.delete(obj)
            .then(
                res => {
                    if (res.isSuccess) {
                        this.getData();
                        toast.success("Your record has been deleted !!", "Product Master");
                    } else {
                        toast.error(res.errors[0], "Product Master");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Product Master");
                }
            )
    }

    handleAddUser = () => {
        history.push({
            pathname: '/products/physical/add-product'
        });
    }

    render() {
        const { data } = this.state;
        let allColumns = ['name', 'title', 'code', 'price', 'salePrice', 'discount', 'quantity', 'shortDetails'];

        return (
            <Fragment>
                <Breadcrumb title="Product List" parent="Products" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Product List</h5>
                                </div>
                                <div className="card-body">
                                    <div className="btn-popup pull-right">
                                        <button type="button" className="btn btn-primary" onClick={this.handleAddUser}>Add Product</button>
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

export default ProductList;