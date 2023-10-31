import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layouts from '../_componets/layouts';

// export const PrivateRoute = ({ component: Component, ...rest }) => {
//     return <Route {...rest} render={props => {
//         return localStorage.getItem('userDetails') ?
//             <Layouts><Component /></Layouts>
//             : <Redirect to={{ pathname: '/auth/login', state: { from: props.location } }} />
//     }} />
// };


export const PrivateRoute = ({ component: Component, ...rest }) => {
    return <Route {...rest} render={props => {
        return localStorage.getItem('userDetails') ?
            <Layouts><Component /></Layouts>
            :  <Layouts><Component /></Layouts>
    }} />
};

