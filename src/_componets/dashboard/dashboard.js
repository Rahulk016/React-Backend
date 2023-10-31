import React, { Component, Fragment } from 'react'
import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigation, Box, MessageSquare, Users } from 'react-feather';
import CountTo from 'react-count-to';
import { reportService } from '../../_services/report/report.service'
import Chart from "react-google-charts";

export class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            data: [],
            varorders: 0,
            varshipAmt: 0,
            varcashOnDelivery: 0,
            varcancelled: 0,

            chartTitle: "",
            chartData: [],
            chartOptions: {
                title: "Order Status",
                curveType: "function",
                legend: { position: "bottom" }
            }
        };
    }

    componentDidMount() {
        this.getNetFigure();
        this.getData();
        this.GetChartOrderStatus();
    }

    getNetFigure = () => {
        reportService.getNetFigure()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({
                            varorders: res.data[0].orders,
                            varshipAmt: res.data[0].shippingAmount,
                            varcashOnDelivery: res.data[0].cashOnDelivery,
                            varcancelled: res.data[0].cancelled
                        });
                    } else {
                        toast.error(res.errors[0], "Dashboard");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Dashboard");
                }
            )
    }
    getData = () => {
        reportService.GetReportManageOrder()
            .then(
                res => {
                    if (res.isSuccess) {
                        this.setState({ data: res.data });
                    } else {
                        toast.error(res.errors[0], "Manage Orders");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Manage Orders");
                }
            )
    };

    GetChartOrderStatus() {
        reportService.GetChartOrderStatus()
            .then(
                res => {
                    if (res.isSuccess) {
                        // chartData: [
                        //     ["Year", "Sales", "Expenses"],
                        //     ["2004", 1000, 400],
                        //     ["2005", 1170, 460],
                        //     ["2006", 660, 1120],
                        //     ["2007", 1030, 540]
                        // ]


                        // counts: 4
                        // date: "14-11-2020"
                        // orderStatus: "Processing"
                        debugger;

                        let objOrderStatusChartData = [];
                        let arr = ["Date"];
                        let allData = res.data;

                        let alldates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
                        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

                        let varStr = "";
                        for (let status of allOrderStatus) {
                            varStr = varStr + " / " + status;
                            arr.push(status);
                        }
                        objOrderStatusChartData[objOrderStatusChartData.length] = arr;


                        let varzero = 0;
                        for (let date of alldates) {
                            arr = ["", varzero, varzero, varzero, varzero];
                            arr[0] = date;
                            for (let status in allOrderStatus) {
                                for (let data in allData) {
                                    if (allOrderStatus[status] === allData[data].orderStatus && date === allData[data].date) {
                                        arr[parseInt(status) + 1] = allData[data].counts;
                                    }
                                }
                            }
                            objOrderStatusChartData[objOrderStatusChartData.length] = arr;
                        }

                        this.setState({
                            chartTitle: varStr.replace("/", ""),
                            chartData: objOrderStatusChartData
                        });

                    } else {
                        toast.error(res.errors[0], "Order Status");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Order Status");
                }
            )
    }

    render() {
        const { varorders, varshipAmt, varcashOnDelivery, varcancelled, data, chartTitle, chartData, chartOptions } = this.state;
        let allColumns = ['orderId', 'orderStatus', 'paymentDate', 'paymentMethod', 'paymentStatus', 'subTotalAmount', 'totalAmount'];
        return (
            <Fragment>
                <Breadcrumb title="Dashboard" parent="Dashboard" />
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-xl-3 col-md-6 xl-50">
                            <div class="card o-hidden widget-cards">
                                <div class="bg-warning card-body">
                                    <div class="media static-top-widget row">
                                        <div class="icons-widgets col-4">
                                            <div class="align-self-center text-center">
                                                <Navigation className="font-warning" />
                                            </div>
                                        </div>
                                        <div class="media-body col-8"><span class="m-0">Orders</span>
                                            <h3 class="mb-0">₹ <CountTo to={varorders} speed={1234} /><small>This Year</small></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6 xl-50">
                            <div class="card o-hidden widget-cards">
                                <div class="bg-secondary card-body">
                                    <div class="media static-top-widget row">
                                        <div class="icons-widgets col-4">
                                            <div class="align-self-center text-center">
                                                <Box className="font-secondary"/>
                                            </div>
                                        </div>
                                        <div class="media-body col-8"><span class="m-0">Shipping amount</span>
                                            <h3 class="mb-0">₹ <CountTo to={varshipAmt} speed={1234} /><small>This Year</small></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6 xl-50">
                            <div class="card o-hidden widget-cards">
                                <div class="bg-primary card-body">
                                    <div class="media static-top-widget row">
                                        <div class="icons-widgets col-4">
                                            <div class="align-self-center text-center">
                                                <MessageSquare className="font-primary"/>
                                            </div>
                                        </div>
                                        <div class="media-body col-8"><span class="m-0">Cash On Delivery</span>
                                            <h3 class="mb-0">₹ <CountTo to={varcashOnDelivery} speed={1234} /><small>This Year</small></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 col-md-6 xl-50">
                            <div class="card o-hidden widget-cards">
                                <div class="bg-danger card-body">
                                    <div class="media static-top-widget row">
                                        <div class="icons-widgets col-4">
                                            <div class="align-self-center text-center">
                                                <Users className="font-danger"/>
                                            </div>
                                        </div>
                                        <div class="media-body col-8"><span class="m-0">Cancelled</span>
                                            <h3 class="mb-0">₹ <CountTo to={varcancelled} speed={1234} /><small>This Year</small></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                        <div class="col-xl-12 xl-100">
                            <div class="card">
                                <div class="card-header">
                                    <h5>Latest Orders</h5>
                                </div>
                                <div class="card-body">
                                    <div class="user-status table-responsive latest-order-table">
                                        <div id="batchDelete" class="category-table custom-datatable transcationdatatable">
                                            <div class="table-responsive">
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
                        </div >
                        <div class="col-sm-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5> {chartTitle} </h5>
                                </div>
                                <div class="card-body sell-graph">
                                    <Chart
                                        chartType="LineChart"
                                        width="100%"
                                        height="400px"
                                        data={chartData}
                                        options={chartOptions}
                                    />
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

export default Dashboard;