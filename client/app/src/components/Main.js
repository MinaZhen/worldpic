
import React from "react";
import { Switch, Route } from "react-router-dom"
import Home from "./Home"
import Register from "./Register"
import Login from "./Login"
import Logout from "./Logout"
import Landing from "./Landing"
import Profile from "./Profile"
import Unregister from "./Unregister"

function Main(){

    return (
    <div className = "main">
        
        <Switch>
            <Route exact path = "/" component={Landing}/>
            <Route path = "/logout" component={Logout}/>
            <Route path = "/register" component={Register}/>
            <Route path = "/login" component={Login}/>
            <Route path = "/profile" component={Profile}/>
            <Route path = "/unregister" component={Unregister}/>
            <Route path = "/world/:username?" component={Home}/>
            <Route path = "/:countryName/:username?" component={Home} />
        </Switch>

    </div>
    )
}

export default Main;