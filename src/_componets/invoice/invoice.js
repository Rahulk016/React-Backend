import React, { Component, Fragment } from 'react'

import 'react-responsive-modal/styles.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { reportService } from '../../_services/report/report.service'

import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';

export class Invoice extends Component {
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
        reportService.GetReportInvoiceList()
            .then(
                res => {
                    debugger;
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "Invoice");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Invoice");
                }
            )
    };

    render() {
        const { data } = this.state;
        let allColumns = ['invoiceNo', 'orderId', 'orderStatus', 'paymentDate', 'paymentMethod','paymentStatus','subTotalAmount','totalAmount'];
        return (
            <Fragment>
                <Breadcrumb title="Reports" parent="Invoice" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Invoice</h5>
                                </div>
                                <div className="card-body">
                                    <div className="clearfix"></div>
                                    <div id="basicScenario" className="product-physical">
                                        <DataTable
                                            myData={data}
                                            showColumns={allColumns}
                                            pagination={true}
                                            editRow={this.onEdit}
                                            deleteRow={this.onDelete}
                                            isAction={false}
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

export default Invoice;