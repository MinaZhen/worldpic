import React, { Component } from "react";
import { withRouter } from "react-router-dom"
import logic from "../logic/index"

class Unregister extends Component {
    state = {
        user: "",
        password: "",
        state: "",
        error: "",
        message: "", 
        modal: ""
    }

    componentDidMount() {
        if (!logic.loggedIn()) this.props.history.push(`/`)
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

        this.setState({ error: "confirm" }, () => this.modalManager())
        
    }

    delete = () => {
        logic.unregister(this.state.user, this.state.password)
            .then(() => this.bucle())
            .catch(error => {
                this.setState({error: error.message}, () => this.modalManager())
            })
    }

    bucle = () => {
        this.setState({message: "See you!"}, () => this.modalManager())

        setTimeout(() => {
            this.redirect()
        }, 1000)
    }

    modalManager = () => {
        let modal = ""
        if (this.state.error === "confirm") {modal = (
            <div className="modal">
                <div className="error-modal">
                    <div className="modal-header"><p>You are going to delete all your information and photos</p></div>
                    <div className="modal-body"> <h2>Are you sure?</h2></div>
                    <div className="modal-footer"> 
                        <button onClick={this.close}>No</button>
                        <button onClick={this.delete}>Yes</button>
                    </div>
                </div>
            </div>
        )} else if (this.state.error !== ""){ modal = (
            <div className="modal" onClick={this.close}>
                <div className="error-modal">
                    <div className="modal-header"><i className="fas fa-exclamation-triangle"/></div>
                    <div className="modal-body"> <h2>{this.state.error}</h2><br/></div>
                    <div className="modal-footer"> <small><sub>Click on window to close</sub></small> </div>
                </div>
            </div>
        )} else if (this.state.message !== ""){ modal = (
            <div className="modal">
                <div className="message-modal"> <h2>{this.state.message}</h2></div>
            </div>
        ) }
        this.setState({error: "", modal })
    }

    close = (e) => {
        e.preventDefault()
        this.setState({ modal: "" })
        this.modalManager()
    }

    redirect = () => {
        this.setState({ modal: "" })
        this.props.history.push(`/`)
    }

    render() {
        const { modal, user, password } = this.state
        return <div className="containers unregister">
            {modal}
            <h1>Delete User</h1>
            <form onSubmit={this.submit}>
                <input type="text" onChange={this.userName} value={user} placeholder="User" />

                <input type="password" onChange={this.userPassword} value={password} placeholder="Password" />
                <button type="submit">Unregister</button>
            </form>
        </div>
    }
}

export default withRouter(Unregister)
