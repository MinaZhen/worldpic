import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import logic from "../logic/index"

class Register extends Component {
    state = {
        user: "",
        password: "",
        location: "",
        state: "",
        token: "",
        error: "",
        message: "", 
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

    userLocation = (e) => {
        const location = e.target.value
        this.setState({ location })
    }

    submit = (e) => {
        e.preventDefault()
        logic.logout()
        return logic.registerUser(this.state.user, this.state.password, this.state.location)
            .then(() => this.bucle())
            .catch(error => {
                this.setState({error: error.message}, () => this.modalManager())
                
            })
    }

    bucle = () => {
        this.setState({message: "You are registered!"}, () => this.modalManager())
        setTimeout(() => {
            this.redirect()
        }, 1000)
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
        if (this.state.message !== "") modal = (
            <div className="modal">
                <div className="message-modal"> <h2>{this.state.message}</h2></div>
            </div>
        ) 
        this.setState({error: "", modal })
    }

    close = (e) => {
        e.preventDefault()
        this.setState({ modal: "" }, () => this.modalManager())
    }

    redirect = () => {
        this.setState({ modal: "" }, () => this.props.history.push(`/login`))
        
    }

    render() {
        const { modal, user, password, location } = this.state
        return <div className="containers register">
            {modal}
            <h1>Register</h1>
            <form onSubmit={this.submit}>
                <input type="text" onChange={this.userName} value={user} placeholder="User" autoComplete="off" />
                <input type="text" onChange={this.userLocation} value={location} placeholder="Nacionality" autoComplete="off" />
                <input type="password" onChange={this.userPassword} value={password} placeholder="Password" autoComplete="off" />

                <button type="submit">Register</button>
            </form>
        </div>
    }
}

export default withRouter(Register)