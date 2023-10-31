import React, { Component } from 'react'
import { history } from './_helpers/history';
import { Router, Switch, Route } from 'react-router-dom';
// Login
import Login from './_componets/auth/login';
// Dashboard
import Dashboard from './_componets/dashboard/dashboard';
// Masters
import Size from './_componets/masters/size';
import Tag from './_componets/masters/tag';
import Color from './_componets/masters/color';
import Category from './_componets/masters/category';
import BrandLogo from './_componets/masters/brandlogo';
import UserType from './_componets/masters/usertype';
//  Product
import Product_list from './_componets/products/physical/product-list';
import Add_Product from './_componets/products/physical/add-product';
// Sales
import Orders, { Order } from './_componets/sales/orders';
import Transcation from './_componets/sales/transcation';
// Users
import List_user from './_componets/users/list-user';
import Create_user from './_componets/users/create-user';
// Profile
import Profile from './_componets/setting/profile';
// Reports
import Report from './_componets/reports/report';
// Invoice
import Invoice from './_componets/invoice/invoice';

// Private Route
import { PrivateRoute } from './_privateRoute/privateRoute';


class App extends Component {
  render() {
    return (
      <Router history={history} >
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/auth/login" component={Login} />

          <PrivateRoute exact path='/dashboard' component={Dashboard} />

          <PrivateRoute exact path='/masters/size' component={Size} />
          <PrivateRoute exact path='/masters/tag' component={Tag} />
          <PrivateRoute exact path='/masters/color' component={Color} />
          <PrivateRoute exact path='/masters/category' component={Category} />
          <PrivateRoute exact path='/masters/usertype' component={UserType} />
          <PrivateRoute exact path='/masters/brandlogo' component={BrandLogo} />

          <PrivateRoute exact path='/products/physical/product-list' component={Product_list} />
          <PrivateRoute exact path='/products/physical/add-product' component={Add_Product} />

          <PrivateRoute exact path='/sales/orders' component={Order} />
          <PrivateRoute exact path='/sales/transaction' component={Transcation} />

          <PrivateRoute exact path='/users/list-user' component={List_user} />
          <PrivateRoute exact path='/users/create-user' component={Create_user} />

          <PrivateRoute exact path='/reports/report' component={Report} />

          <PrivateRoute exact path='/settings/profile' component={Profile} />

          <PrivateRoute exact path='/invoice' component={Invoice} />

          <Route path='*' exact component={Login} />
        </Switch>
      </Router>
    )
  }
}


export default App;