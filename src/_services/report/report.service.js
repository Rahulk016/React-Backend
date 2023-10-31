import Global from '../../_helpers/global';
import { authHeader } from '../../_helpers/auth-header';

export const reportService = {
    GetReportInvoiceList,
    GetReportManageOrder,
    GetReportTransactionDetails,
    getNetFigure,
    GetChartOrderStatus,
    GetChartSalesDataPaymentTypeWise,
    GetChartUserGrowth
};

async function GetReportInvoiceList() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(false)
    };

    return fetch(Global.BASE_API_PATH + `PaymentMaster/GetReportInvoiceList/`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res;
        });
}
async function GetReportManageOrder() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(false)
    };

    return fetch(Global.BASE_API_PATH + `PaymentMaster/GetReportManageOrder/`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res;
        });
}
async function GetReportTransactionDetails() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(false)
    };

    return fetch(Global.BASE_API_PATH + `PaymentMaster/GetReportTransactionDetails/`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res;
        });
}
async function getNetFigure() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(false)
    };

    return fetch(Global.BASE_API_PATH + `PaymentMaster/GetReportNetFigure/`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res;
        });
}
async function GetChartOrderStatus() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(false)
    };

    return fetch(Global.BASE_API_PATH + `PaymentMaster/GetChartOrderStatus/`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res;
        });
}
async function GetChartSalesDataPaymentTypeWise() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(false)
    };

    return fetch(Global.BASE_API_PATH + `PaymentMaster/GetChartSalesDataPaymentTypeWise/`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res;
        });
}
async function GetChartUserGrowth() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(false)
    };

    return fetch(Global.BASE_API_PATH + `PaymentMaster/GetChartUserGrowth/`, requestOptions)
        .then(handleResponse)
        .then(res => {
            return res;
        });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = JSON.parse(text);

        if (!response.ok) {
            if (response.status === 401) {

            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}