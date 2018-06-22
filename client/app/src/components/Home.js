import React, { Component } from "react";
import { Switch, Route } from "react-router-dom"
import { withRouter } from "react-router-dom"
import World from "./World"
import Country from "./Country"
import logic from "../logic"


class Home extends Component {
    state = { error: "", modal: "" }

    componentWillMount() {
        if (logic.loggedIn()) {
            return logic.retrieveUser()
            .then(res => {
                if (res.status === "KO") {
                    this.setState({error: "Something wrong happened... Try to log in again"}, () => this.modalManager())
                }
                return res
            }).catch(()=> {
                this.setState({error: "Something wrong happened..."}, () => this.modalManager())
            })
        } else this.props.history.push(`/`)  
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
        <div className="home">
            {this.state.modal}
            <Switch>
                <Route exact path = "/world/:username?" component={World}/>
                <Route exact path = "/:countryName/:username?" component={Country} />
            </Switch>
        </div>)
    }
}

export default withRouter(Home)