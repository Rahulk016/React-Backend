import React, { Component, Fragment } from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'

export default class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myData: this.props.myData
        };

    }
    componentWillReceiveProps(nextProps) {
        this.setState({ myData: nextProps.myData });
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        
        const { showColumns, editRow, deleteRow, isAction } = this.props;
        const { myData } = this.state;
        const columns = [];
        let colName = "";

        for (let key of showColumns) {
            if (key === 'imagePath') {
                colName = "Image Path";
            } else if (key === "isSave") {
                colName = "Save Value"
            } else {
                colName = key.toString();
            }

            if (key === "imagePath") {
                columns.push(
                    {
                        Header: <b>{this.Capitalize(colName)}</b>,
                        accessor: key,
                        Cell: (row) => {
                            console.log(row);
                            return <img alt="_image" src={row.original.imagePath} style={{ width: 50, height: 50 }} />
                        },
                        style: {
                            textAlign: 'center'
                        },
                        sortable: false
                    }
                );
            }

            else if (key === "orderStatus") {
                columns.push(
                    {
                        Header: <b>{this.Capitalize(colName)}</b>,
                        accessor: key,
                        Cell: (row) => {
                            return <div dangerouslySetInnerHTML={{ __html: row.original.orderStatus }} ></div>
                        },
                        style: {
                            textAlign: 'center'
                        },
                        sortable: false
                    }
                );
            }
            else if (key === "paymentStatus") {
                columns.push(
                    {
                        Header: <b>{this.Capitalize(colName)}</b>,
                        accessor: key,
                        Cell: (row) => {
                            return <div dangerouslySetInnerHTML={{ __html: row.original.paymentStatus }} ></div>
                        },
                        style: {
                            textAlign: 'center'
                        },
                        sortable: false
                    }
                );
            }
            else {
                columns.push(
                    {
                        Header: <b>{this.Capitalize(colName)}</b>,
                        accessor: key,
                        style: {
                            textAlign: 'center'
                        }
                    }
                );
            }
        }

        if (isAction) {
            columns.push(
                {
                    Header: <b>Actions</b>,
                    accessor: 'delete',
                    Cell: (row) => (
                        <div>
                            <span onClick={() => {
                                Swal.fire({
                                    title: 'Are you sure?',
                                    text: 'You will not be able to recover this record!'
                                    ,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes, delete it!',
                                    cancelButtonText: 'No, keep it'
                                }).then((result) => {
                                    if (result.value) {
                                        let data = myData[row.index];
                                        deleteRow(data.id);
                                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                                        Swal.fire(
                                            'Cancelled',
                                            'Your record is safe :)',
                                            'error'
                                        )
                                    }
                                }
                                )
                            }} >
                                <i class="fa fa-trash-o" style={{ width: 35, fontSize: 20, padding: 11, color: 'red' }} ></i>
                            </span>

                            <span onClick={() => {
                                let data = myData[row.index];
                                editRow(data);
                            }} >
                                <i class="fa fa-edit" style={{ width: 35, fontSize: 20, padding: 11, color: 'green' }}></i>
                            </span>
                        </div>
                    ),
                    style: {
                        textAlign: 'center'
                    },
                    sortable: false
                }
            )
        }
        return (
            <Fragment>
                {isAction ?
                    <ReactTable
                        noDataText="Loading..."
                        data={myData}
                        columns={columns}
                        minRows={0}
                        defaultPageSize={(myData.length > 5 ? 5 : myData.length) === 0 ? 5 : myData.length}
                        showPagination={myData.length > 5 ? true : false}
                    />
                    :
                    <ReactTable
                        noDataText="Loading..."
                        data={myData}
                        columns={columns}
                        minRows={0}
                        defaultPageSize={(myData.length > 5 ? 5 : myData.length) === 0 ? 5 : myData.length}
                        showPagination={myData.length > 5 ? true : false}
                        filterable
                        defaultFilterMethod={(filter, row) =>
                            (row[filter.id] === filter.value)
                        }
                    />
                }


                <ToastContainer />
            </Fragment>
        )
    }
}

