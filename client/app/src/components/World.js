import React, { Component } from "react"
import { withRouter } from "react-router-dom"
import world from "./maps/world-50m.json"
import logic from "../logic/index"
import { ComposableMap, ZoomableGlobe, Geographies, Geography, } from "react-simple-maps"

const mapStyles = {
  width: "90vw",
  maxWidth: "80vh",
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
    error: "",
    modal: ""
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

  clicking(value) { this.props.history.push(`/${value.properties.name}`) }

  paint(num) { if (num === -1) return "#F1ECEC"; else return "#FF6611" }

  render() {
    const {loading, modal} = this.state
    if (loading) {
      return (<div className="world"> {modal} </div>)
    } else {
      return (
        <div className="world">
          {modal}
          <ComposableMap
            width={500}
            height={500}
            projection="orthographic"
            projectionConfig={{ scale: 220 }}
            style={mapStyles}
          >
            <ZoomableGlobe>
              <circle cx={250} cy={250} r={220} fill="#ffffff99" stroke="#CFD8DC" />
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
                          fill: "#f15a2455",
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
        </div>
      )
    }
  }
}

export default withRouter(BasicMap)