import React, { Component, Fragment } from 'react';
import Breadcrumb from '../../_componets/common/breadcrumb';
import DataTable from '../common/datatable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { reportService } from '../../_services/report/report.service'
import Chart from "react-google-charts";

export class Report extends Component {
    constructor() {
        super();

        this.state = {
            data: [],
            salesChartData: [],
            salesChartOptions: {
                title: 'Sales Data',
                hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
                vAxis: { minValue: 0 },
                // For the legend to fit, we make the chart area smaller
                chartArea: { width: '50%', height: '70%' },
                // lineWidth: 25
            },

            customerGrowthData: [],
            customerGrowthOptions: {
                title: "Customer Growth",
                curveType: "function",
                legend: { position: "bottom" }
            },
            orderStatusData:[]
        };
    }

    componentDidMount() {
        this.getData();
        this.ChartSalesDataPaymentTypeWise();
        this.GetChartUserGrowth();
        this.GetChartOrderStatus();
    }

    getData = () => {
        reportService.GetReportInvoiceList()
            .then(
                res => {
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

    ChartSalesDataPaymentTypeWise = () => {
        reportService.GetChartSalesDataPaymentTypeWise()
            .then(
                res => {
                    if (res.isSuccess) {
                        // char={[
                        //     ['Year', 'Sales', 'Expenses'],
                        //     ['2013', 1000, 400],
                        //     ['2014', 1170, 460],
                        //     ['2015', 660, 1120],
                        //     ['2016', 1030, 540],
                        // ]}
                        // options={{
                        //     title: 'Company Performance',
                        //     hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
                        //     vAxis: { minValue: 0 },
                        //     // For the legend to fit, we make the chart area smaller
                        //     chartArea: { width: '50%', height: '70%' },
                        //     // lineWidth: 25
                        // }}

                        let objSalesChartData = [];
                        let arr = ["Date"];
                        let allData = res.data;

                        let alldates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
                        let allPaymentType = allData.map(item => item.paymentType).filter((value, index, self) => self.indexOf(value) === index);

                        for (let status of allPaymentType) {
                            arr.push(status);
                        }
                        objSalesChartData[objSalesChartData.length] = arr;


                        let varzero = 0;
                        for (let date of alldates) {
                            arr = ["", varzero, varzero, varzero, varzero, varzero];
                            arr[0] = date;
                            for (let status in allPaymentType) {
                                for (let data in allData) {
                                    if (allPaymentType[status] === allData[data].paymentType && date === allData[data].date) {
                                        arr[parseInt(status) + 1] = allData[data].counts;
                                    }
                                }
                            }
                            objSalesChartData[objSalesChartData.length] = arr;
                        }

                        this.setState({
                            salesChartData: objSalesChartData
                        });
                    } else {
                        toast.error(res.errors[0], "Sales Payment Type Wise");
                    }
                },
                error => {
                    toast.error("Something went wrong", "Sales Payment Type Wise");
                }
            )
    }
    GetChartUserGrowth = () => {
        reportService.GetChartUserGrowth()
            .then(
                res => {
                    if (res.isSuccess) {
                        let objUserGrowthData = [];
                        let arr = ["Date", "Counts"];
                        objUserGrowthData[objUserGrowthData.length] = arr;

                        let allData = res.data;
                        let alldates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);

                        for (let date of alldates) {
                            for (let data in allData) {
                                if (date === allData[data].date) {
                                    arr = [];
                                    arr[0] = date;
                                    arr[1] = allData[data].counts;
                                }
                            }
                            objUserGrowthData[objUserGrowthData.length] = arr;
                        }

                        this.setState({
                            customerGrowthData: objUserGrowthData
                        });
                    } else {
                        toast.error(res.errors[0], "User Growth");
                    }
                },
                error => {
                    toast.error("Something went wrong", "User Growth");
                }
            )
    }
    
    
    GetChartOrderStatus() {
        reportService.GetChartOrderStatus()
            .then(
                res => {
                    if (res.isSuccess) {
                        let objOrderStatusChartData = [];
                        let arr = ["Date"];
                        let allData = res.data;

                        let alldates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
                        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

                        for (let status of allOrderStatus) {
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
                            orderStatusData: objOrderStatusChartData
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
        const { data, salesChartData, salesChartOptions, customerGrowthData, customerGrowthOptions,orderStatusData } = this.state;
        let allColumns = ['invoiceNo', 'orderId', 'orderStatus', 'paymentDate', 'paymentMethod', 'paymentStatus', 'subTotalAmount', 'totalAmount'];
        return (
            <Fragment>
                <Breadcrumb title="Reports" parent="Reports" />
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-xl-12 col-md-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5>Sales Data Payment Type Wise</h5>
                                </div>
                                <div class="card-body sell-graph">
                                    <Chart
                                        width={'500px'}
                                        height={'300px'}
                                        chartType="AreaChart"
                                        loader={<div>Loading Chart</div>}
                                        data={salesChartData}
                                        options={salesChartOptions}
                                        // For tests
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-12 col-md-12">
                            <div class="card report-employee">
                                <div class="card-header">
                                    <h5>Customer Growth</h5>
                                </div>
                                <div class="card-body p-0 o-hidden">
                                    <div>
                                        <Chart
                                            chartType="ScatterChart"
                                            width="80%"
                                            height="400px"
                                            data={customerGrowthData}
                                            options={customerGrowthOptions}
                                            legendToggle
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5>Invoice List</h5>
                                </div>
                                <div class="card-body">
                                    <div id="batchDelete" class="custom-datatable">
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
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-header">
                                    <h5>Order status data</h5>
                                </div>
                                <div class="card-body">
                                    <div class="sales-chart">
                                    <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={orderStatusData}
        />
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

export default Report;