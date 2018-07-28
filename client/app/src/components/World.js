import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import world from "./maps/world-50m.json"
import logic from "../logic/index"
import { ComposableMap, ZoomableGlobe, ZoomableGroup, Geographies, Geography, } from "react-simple-maps"

const mapStyles = {
  width: "90vw",
  maxWidth: "90vh",
  height: "auto",
  maxHeight: "90vw",
}

let visited = ["places"]

class BasicMap extends Component {
  constructor() {
    super()
    this.clicking = this.clicking.bind(this)
    this.visited = visited
  }
  state = {
    loading: true,
    zoom: 1,
    error: "",
    modal: "", 
    globe: false
  }

  componentDidMount() {
    if (logic.loggedIn()) {
      this.modalManager()
      setTimeout(() =>{
        return logic.world(logic.userId)
          .then(countries => {
            if (countries.length) {
              visited = countries
              this.setState({ loading: false, modal: "" })
            } else {
              visited.length = 0
              this.setState({ loading: false, modal: "" })
            }
          })
          .catch(error => {
            console.log("E>> "+ error.message)
            this.setState({error: error.message}, () => this.modalManager())
            
          })
      }, 700)
    } else this.props.history.push(`/`)
  }

  modalManager() {
    let modal = ""
    if (this.state.error !== "") {modal = (
      <div className="modal" onClick={this.close}>
        <div className="error-modal">
          <div className="modal-header"><i className="fas fa-exclamation-triangle" /></div>
          <div className="modal-body"> <h2>{this.state.error}</h2><br /></div>
          <div className="modal-footer"> <small><sub>Click on window to close</sub></small> </div>
        </div>
      </div>
    )} else if (this.state.loading) modal = (
      <div className="modal">
        <div className="message-modal"> <h2>LOADING <i className="fas fa-spinner fa-spin" /></h2></div>
      </div>
    )
    this.setState({ error: "", modal })
  }

  close = (e) => {
    e.preventDefault()
    this.setState({ modal: "" }, () => this.props.history.push(`/profile`))
  }

  zoomIn = () => { 
    var zoom = this.state.zoom 
    if (zoom < 10) zoom += 1
    this.setState({zoom})
  }

  zoomOut = () => { 
    var zoom = this.state.zoom 
    if (zoom > 1) zoom -= 1
    this.setState({zoom})
  }

  switchMap = () => {
    this.state.globe === true ? this.setState({globe : false}) : this.setState({globe : true})
  }

  clicking(value) { this.props.history.push(`/${value.properties.name}`) }

  paint(num) { if (num === -1) return "#F1ECEC"; else return "#FF6611" }

  render() {
    const {loading, zoom, modal, globe} = this.state
    if (loading) {
      return (<div className="world"> {modal} </div>)
    } else {
      return (
        <div className="world">
          <div className="touch-info"> Use two fingers to drag. </div>
          {modal}
          {globe ? (
            <ComposableMap
              className="globe"
              width={1000}
              height={1000}
              projection="orthographic"
              projectionConfig={{ scale: "200" }}
              style={mapStyles}
            >
              <ZoomableGlobe zoom={zoom}>
                <defs>
                  <radialGradient id="exampleGradient">
                    <stop offset="15%" stopColor="rgba(255, 255, 255, 0.1)"/>
                    <stop offset="55%" stopColor="rgba(255, 245, 240, 0.01)"/>
                    <stop offset="100%" stopColor="rgba(255, 168, 100, 0.1)"/>
                  </radialGradient>
                </defs>
                <circle cx={500} cy={500} r={200} fill="url(#exampleGradient)" stroke="#CFD8DC" />
                <Geographies disableOptimization geography={world}>
                  {(geographies, projection) => geographies.map((geography, i) => {
                    this.visited.push({ index: i, name: geography.properties.name })

                    return geography.id !== "ATA" && (
                      <Geography
                        key={i}
                        geography={geography}
                        projection={projection}
                        onClick={this.clicking}
                        style={{
                          default: {
                            fill: this.paint(visited.indexOf(geography.properties.name)),
                            stroke: "#8B7060",
                            strokeWidth: 0.15,
                            outline: "none",
                          },
                          hover: {
                            fill: "rgba(241, 90, 24, 0.4)",
                            stroke: "#8B7060",
                            strokeWidth: 0.15,
                            outline: "none",
                          },
                          pressed: {
                            fill: "#FF5722",
                            stroke: "#8B7060",
                            strokeWidth: 0.15,
                            outline: "none",
                          },
                        }}
                      />
                    )
                  })
                  }
                </Geographies>
              </ZoomableGlobe>
            </ComposableMap>
          ) : (
            <div className="map">
            <ComposableMap
              projectionConfig={{
                scale: 200,
                rotation: [-11, 0, 0],
              }}
              width={1000}
              height={1000}
              style={{
                width: "100%",
                height: "auto",
              }}
            >
              <ZoomableGroup center={[0, 20]} zoom={zoom}>
                <Geographies geography={world}>
                  {(geographies, projection) => geographies.map((geography, i) => {
                    this.visited.push({ index: i, name: geography.properties.name })
    
                    return geography.id !== "ATA" && (
                      <Geography
                        key={i}
                        geography={geography}
                        projection={projection}
                        onClick={this.clicking}
                        style={{
                          default: {
                            fill: this.paint(visited.indexOf(geography.properties.name)),
                            stroke: "#607D8B",
                            strokeWidth: 0.15,
                            outline: "none",
                          },
                          hover: {
                            fill: "#FF9900",
                            stroke: "#607D8B",
                            strokeWidth: 0.15,
                            outline: "none",
                          },
                          pressed: {
                            fill: "#FF5722",
                            stroke: "#607D8B",
                            strokeWidth: 0.15,
                            outline: "none",
                          },
                        }}
                      />
                    )
                  })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
          )}
          
          <div className="buttons-world">
            <button className="zoom" onClick={this.zoomOut}><i className="fas fa-minus-circle fa-2x"></i></button>
            <button className="changemap" onClick={this.switchMap}> Change View </button>
            <button className="zoom" onClick={this.zoomIn}><i className="fas fa-plus-circle fa-2x"></i></button>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(BasicMap)