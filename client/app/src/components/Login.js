import React, { Component } from "react";
import { withRouter } from "react-router-dom"
import logic from "../logic/index"
import api from "api"


class Login extends Component {
    state = {
        user: "",
        password: "",
        state: "",
        token: "",
        error: "",
        modal: ""
    }

    userName = (e) => {
        const user = e.target.value
        this.setState({ user })
    }

    userPassword = (e) => {
        const password = e.target.value
        this.setState({ password })
    }

    submit = (e) => {
        e.preventDefault()
        return logic.login(this.state.user, this.state.password)
            .then(() => {
                sessionStorage.setItem("userId", logic.userId)
                sessionStorage.setItem("token", api.token)
                this.props.history.push(`/profile`)
            })
            .catch(error => {
                this.setState({error: error.message}, () => this.modalManager())
            })
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
        this.setState({ modal: "" },() => this.modalManager())
    }

    render() {
        const { modal, user, password } = this.state
        return (
        <div className="containers login">
            {modal}
            <h1>Login</h1>
            <form onSubmit={this.submit} className="form login-form">
                <input type="text" onChange={this.userName} value={user} placeholder="User" autoComplete="off" />
                <input type="password" onChange={this.userPassword} value={password} placeholder="Password" autoComplete="off" />
                <br/>
                <button type="submit">Login</button>
            </form>
        </div>
        )}
}

export default withRouter(Login)