import React, { Component } from 'react';
import man from '../../../assets/images/user.png';


export class User_panel extends Component {
    render() {
        return (
            <div>
                <div className="sidebar-user text-center">
                    <div><img className="img-60 rounded-circle lazyloaded blur-up" alt="user Image" src={man} />
                    </div>
                    <h6 className="mt-3 f-14">Rahul Dubey</h6>
                    <p>Admin</p>
                </div>
            </div>
        )
    }
}

export default  User_panel;