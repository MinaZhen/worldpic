import React, { Component } from "react";
import { withRouter } from "react-router-dom"
import logic from "../logic"

class Profile extends Component {
    state = {
        data: {},
        username: "",
        location: "",
        error: "",
        modal: ""
    }

    componentDidMount() {
        if (logic.loggedIn()) {
            logic.retrieveUser()
                .then(res => {
                    if (res.status === "KO") {
                        this.setState({error: "Something wrong happened... Try to log in again"}, () => this.modalManager())
                    }
                    return res
                })
                .then(data => {
                    this.setState({
                        data,
                        username: data.username,
                        location: data.location
                    })
                }).catch(() => {
                    this.setState({error: "Something wrong happened..."}, () => this.modalManager())
                })
        }  else this.props.history.push(`/`)
    }

    modalManager() {
        let modal = ""
        if (this.state.error !== "") modal = (
            <div className="modal" onClick={this.close}>
                <div className="error-modal">
                <div className="modal-header"><i className="fas fa-exclamation-triangle"/></div>
                <div className="modal-body"> <h2>{this.state.error}</h2><br/></div>
                <div className="modal-footer"> <small><sub>Click on window to close</sub></small> </div>
                </div>
            </div>
        )
        this.setState({error: "", modal })
    } 

    close = (e) => {
        e.preventDefault()
        logic.logout()
        this.setState({ modal: "" },() => this.props.history.push(`/login`))
    }

    render() {
        return (
            <div className="containers profile">
                <h1>Profile</h1>
                    {this.state.modal}
                    <article className="info">
                        <p> Username: </p>
                        <h1>{this.state.username}</h1>
                        <br/>
                        <p> Location: </p>
                        <h3>{this.state.location}</h3>
                        <br/>
                    </article>

            </div >
        )
    }
}

export default withRouter(Profile)

