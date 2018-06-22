import React, { Component } from "react";
import { withRouter } from "react-router-dom"
import logic from "../logic"

class Country extends Component {
    state = {
        photos: [], 
        countryName: this.props.match.params.countryName,
        username: this.props.match.params.username,
        selected: "NONE",
        error: "",
        message: "",
        modal: ""
    }

    componentWillMount() {
        if (logic.loggedIn()) {
            this.setState({ selected : "NONE"})
            this.reload()
        } else this.props.history.push(`/`)  
    }

    reload() {
        logic.retrieveCountry(this.state.countryName)
            .then(data => {
                const photos = []
                if (data !== undefined) {
                    data.photos.forEach((v) => {
                        let obj = {_id: v._id, url: logic.retrieveCloudPhoto(v.url)}
                        photos.push(obj)
                    })
                    const pic = data.photos[0]
                    const picSel = {id: pic._id, url: logic.retrieveCloudPhoto(pic.url, 1)}
                    this.setState({ photos, selected: picSel})
                } 
            }).catch(error => {
                this.setState({error: error.message}, () => this.modalManager())
            })
    }

    upload = (e) => {
        if (this.state.photos.length < 20) {
            let file = e.target.files[0]
            if (file.type.indexOf("image") > -1) {
                return logic.addCloudPhoto(file)
                .then(add => {
                    logic.addPhoto(this.state.countryName, add)
                    .then(()=> { this.reload() })
                }).catch(error => console.error(error.message))           
            } else this.setState({message: "You should upload an image"}, () => this.modalManager())
        } else this.setState({message: "You can upload until 30 photos per country"}, () => this.modalManager())
    }

    retrievePhoto = (e) => {
        const country = this.state.countryName
        return logic.retrievePhoto(country, e.target.name)
        .then((res) => { 
            const picSel = {id: res.id, url: logic.retrieveCloudPhoto(res.url, 1)}
            this.setState({ selected: picSel}) 
        }).catch(error => {
            this.setState({error: error.message}, () => this.modalManager())
        })
    }

    deletePicture = (e) => {
        const { countryName, selected } = this.state

        return logic.retrievePhoto(countryName, selected.id)
        .then(res => {         
            return logic.removeCloudPhoto(res.url)
            .then(() => {
                return logic.removePhoto(countryName, res.id)
                .then(()=> { 
                    if (this.state.photos.length > 1) { this.reload()
                    } else {
                        this.setState({ photos: [], selected: "NONE" })
                        this.reload()
                    }
                })
            })
        }).catch(error => {
            this.setState({error: error.message}, () => this.modalManager())
        })
    }

    order = (e) => {
        let prop = e.target.name
        let photos = this.state.photos
        let sel = 0
        photos.forEach((v, i) => {
            if (v._id === this.state.selected.id) {
                sel = i
            }
          });
        if (prop === "right") photos = photos.splice(1).concat(photos.splice(0, 1)) 
        if (prop === "left") photos = photos.splice(-1).concat(photos.splice(0)) 

        const picSel = {id: photos[sel]._id, url: logic.retrieveCloudPhoto(photos[sel].url, 1)}
        this.setState({ photos, selected: picSel })
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
            <div className="modal" onClick={this.close}>
                <div className="message-modal"> <h2>{this.state.message}</h2></div>
            </div>
        ) 
        this.setState({ modal })
    }

    close = (e) => {
        e.preventDefault()
        this.setState({ error: "", message: "", modal: "" }, () => this.modalManager())
    }


    render() {
        const { modal, username, countryName, photos, selected } = this.state
        return (
        <div className="containers country">
            {modal}
            <h1>{countryName}</h1>
            {(username === undefined) ? <h5> My photos </h5> : <h5>from {username}</h5> }

            <div className="album-container">
                {((photos.length === 0) || (selected === "NONE")) ? <div></div> : 
                    <div className="preview-pic" style={{backgroundImage: `url(${selected.url})`}}>
                        <div className="delete-pic">
                            <button name={selected._id} className="btn-carlos-velocirraptor-girafa" onClick={this.deletePicture}><i className="fas fa-trash fa-xs"></i></button>
                        </div>
                    </div> 
                }
                {((photos.length === 0) || (selected === "NONE")) ? <div></div> : 
                    <div className="album">
                        <div className="arrows arrow-left"><button name="left" onClick={this.order}> ◀ </button></div>
                        {photos.map((photo, i) =>
                            <div key={photo._id} className="photo">
                                <img src={photo.url} alt={countryName} name={photo._id} onClick={this.retrievePhoto}/>
                            </div>)}
                        <div className="arrows arrow-right"><button name="right" onClick={this.order}> ▶ </button></div>
                    </div>
                }
            </div>
                <label className="file-upload-container" htmlFor="file-upload">
                    <input id="file-upload" onChange={this.upload} type="file" style={{display: "none"}}/>
                    Select picture 
                </label>

        </div>)
    }
}

export default withRouter(Country)