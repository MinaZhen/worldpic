import React, {Component} from "react";
import { Link } from "react-router-dom"

class Header extends Component {
    constructor() {
        super();
        this.reponsiveButton = React.createRef();
        this.state = {
          width:  0,
          height: 0,
          display : "flex"
        }
      }
    
      updateDimensions() {
        const width = window.innerWidth
        const height = window.innerHeight

        if ((width < height) && (this.state.display === "flex")){
            this.setState({width, height, display: "none"})
        } else if ((width > height) && (this.state.display === "none")){
            this.setState({width, height, display: "flex"})
        }
      }
    
    componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    this.setState({width:  window.innerWidth, height: window.innerHeight})
    
    }

    componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    landingNav = (style) => {return(
        <nav className="header-nav" style={{display: style}}>
            <Link className="link" to="/login" onClick={this.showHide}> Login </Link>
            <Link className="link" to="/register" onClick={this.showHide}> Register </Link>
        </nav>
    )}


    regularNav = (style) => {
        
        return(
        <nav className="header-nav" style={{display: style}}>
            <Link className="link" to="/unregister" onClick={this.showHide}> Unregister </Link>
            <Link className="link" to="/profile" onClick={this.showHide}> Profile </Link>
            <Link className="link" to="/world" onClick={this.showHide}> Home </Link>
            <Link className="link" to="/logout" onClick={this.showHide}> Log out </Link>
        </nav>
    )}

    showHide = () => {
        if (this.state.width < this.state.height) {

            if (this.state.display === "none")
            this.setState({display: "flex"}); 
            else this.setState({display: "none"});
        }
        
    }

    render() {
        return (
            <header className="header-menu">
                <Link to="/"><img className="title_wp link" src="/title_light.png" alt="WorldPic"/></Link>
                {sessionStorage.getItem('userId') ? this.regularNav(this.state.display) : this.landingNav(this.state.display)}
                <div className="menu-button" onClick={this.showHide} ref={this.reponsiveButton}><img src="/icoPhoto.png" alt="WorldPic"/><i className="fas fa-bars fa-2x"/></div>
            </header>
        )

    }
}

export default Header
