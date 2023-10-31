import React, { Component } from 'react'
import Header from './common/header_components/header'
import Footer from './common/footer';
import Sidebar from './common/sidebar_components/sidebar';

class Layouts extends Component {
    render() {
        return (
            <div className="page-wrapper" >
                <Header />
                <div className="page-body-wrapper" >
                    <Sidebar />
                    <div className="page-body" >
                        {this.props.children}
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default Layouts;