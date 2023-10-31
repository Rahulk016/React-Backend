import React, { Component, Fragment } from 'react';
import userPic from '../../assets/images/user.png';
import Breadcrumb from '../common/breadcrumb';
import { Tabset_profile } from './tabset-profile';

export class Profile extends Component {
    render() {
        return (
            <Fragment>
                 <Breadcrumb title="Profile" parent="settings" />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="profile-details text-center">
                                        <img src={userPic} alt="User Pic" className="img-fluid img-90 rounded-circle blur-up
lazyloaded" />
                                        <h5 className="f-w-600 f-16 mb-0">Rahul Dubey</h5>
                                        <span>rahul@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8">
                            <div className="card profile-card">
                                <div className="card-body">
                                 <Tabset_profile />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Fragment>
        )
    }
}

export default Profile;