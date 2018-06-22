import React, { Component } from "react";
import Three from "./landing/Three"

class Landing extends Component {
    state = {
        wheel : 0,
        opacity: 0,
        div1 : { opacity : 1 },
        div2 : { opacity : 0 },
        div3 : { opacity : 0 },
        div4 : { opacity : 0 }
    }
    _onWheel = (e) => {
        let wheel = e.deltaY
        let opacity = this.state.opacity + wheel * 0.0005
        opacity %= 4
        if (opacity < 0) opacity = 4

        let int = Math.ceil(opacity)
        let add = opacity - (int - 1)
        let subs = int - opacity
        this.setState({ opacity, wheel })
        this.divSwitch(int, add, subs)
    }

    divSwitch(int, add, subs) {
        switch(int){
            case 1:
                this.setState({ div1: { opacity : subs }, div2: { opacity : 0 }, div3: { opacity : 0 }, div4: { opacity : add } })
                break;
            case 2:
                this.setState({ div1: { opacity : 0 }, div2: { opacity : add }, div3: { opacity : 0 }, div4: { opacity : subs } })
                break;
            case 3:
                this.setState({ div1: { opacity : 0 }, div2: { opacity : subs }, div3: { opacity : add }, div4: { opacity : 0 } })
                break;
            case 4:
                this.setState({ div1: { opacity : add }, div2: { opacity : 0 }, div3: { opacity : subs }, div4: { opacity : 0 } })
                break;
            default: break;
        }
        
    }
    render () {
        const { div1, div2, div3, div4} = this.state
        return (
            
            <div className="containers landing" onWheel={this._onWheel}>
                <div className="three-z-5">
                    <Three/>
                </div>
                <div className="landing-divs">
                    <div className="landing-div-top-left" style={div1}>
                        <h1> Travel </h1>
                        <p> Around the world </p>
                    </div>
                    <div className="landing-div-top-right" style={div2}>
                        <h1> Find </h1>
                        <p> Friends </p>
                    </div>
                    <div className="landing-div-bottom-left" style={div3}>
                        <h1> Upload </h1>
                        <p> Your pictures </p>
                    </div>
                    <div className="landing-div-bottom-right" style={div4}>
                        <h1> Share </h1>
                        <p> Experiences </p>
                    </div>
                    <div className="message-scroll"> Scroll up or down </div>
                </div>
            </div>
        )
    }
}

export default Landing