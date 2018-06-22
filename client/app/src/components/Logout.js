import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import logic from '../logic/index'


class Logout extends Component {

    logout = () => {
        logic.logout()
        const history = this.props.history
        setTimeout(() => { history.push(`/`) }, 1000);
    }

    render() {
        return (
        <div className="containers"> 
            {this.logout()} 
            <div className="modal">
                <div className="message-modal"> <h2>You logged out</h2></div>
            </div>
        </div>)
    }
}

export default withRouter(Logout)