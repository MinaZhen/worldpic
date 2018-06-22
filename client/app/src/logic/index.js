const travelApi = require("api")
const cloudApi = require("cloud-api")

// travelApi.url = "http://localhost:4000/api"
travelApi.url = "https://radiant-woodland-60903.herokuapp.com/api"

const logic = {
    userId: "NO-ID",
    username: "",
    visited : [],

    registerUser(username, password, location) {
        return travelApi.registerUser(username, password, location)
    },

    login(username, password, location) {
        return travelApi.authenticateUser(username, password, location)
            .then(userId => {
                this.userId = userId 
                sessionStorage.setItem('userId', userId) 
                return true
            })
    },

    loggedIn() { 
        let userId = this.userId
        let token = travelApi.token
        if (sessionStorage.getItem("userId") !== userId) return false
        if (sessionStorage.getItem("token") !== token) return false

        return userId !== null && token !== null
    },

    logout() {
        sessionStorage.clear();
        this.userId = "NO-ID"
        travelApi.token = "NO-TOKEN"
        return true
    },

    retrieveUser(userId = this.userId) {
        return travelApi.retrieveUser(userId)
            .then((res) => {
                this.username = res.username
                return res
            })
    },

    unregister(username, password) {
        const userId = this.userId
        return this.retrieveUser(userId)
        .then(({countries}) => {
            if (countries.length) {
                const promises = countries.map(country => { 
                    return this.retrieveCountry(country.name)
                    .then((place) => {
                        const promCountry = place.photos.map(photo => this.removeCloudPhoto(photo.url))
                        return Promise.all(promCountry)
                    })
                })
                return Promise.all(promises)
                .then(() => {
                    return travelApi.unregisterUser(userId, username, password)
                    .then((res) => {
                        this.logout()
                        return res
                    })  
                }) 
            } else {
                return travelApi.unregisterUser(userId, username, password)
                .then((res) => {
                    this.logout()
                    return res
                }) 
            }
        })       
    },

    world(userId = this.userId) {
        return travelApi.world(userId)
    },

    retrieveCountry(countryName, userId = this.userId) {
        return travelApi.retrieveCountry(userId, countryName)
            .then((res) => res) 
    },

    addCloudPhoto(file){
        return cloudApi.uploadPhoto(file)
        .then((res) => res) 
    },
    
    addPhoto(countryName, url) {
        const userId = this.userId
        return travelApi.addPhoto(userId, countryName, url)
    },
    /**
     * Returns the url that shows the pictures with different sizes and forms
     * @param {*} url 
     * @param {Number} form 0 / 1 / 2 - little / medium / rounded(avatar)
     */
    retrieveCloudPhoto(url, form) {
        let filename = url.slice(url.lastIndexOf("/") + 1)
        return cloudApi.retrievePhoto(filename, form)
    },

    retrievePhoto(countryName, photoId, userId = this.userId) {
        return travelApi.retrievePhoto(userId, countryName, photoId)
    },

    updatePhoto(countryName, photoId, newUrl) {
        const userId = this.userId
        return travelApi.updatePhoto(userId, countryName, photoId, newUrl)
    },
    /**
     * 
     * @param {string} url - gets from url the public_id
     */
    removeCloudPhoto(url){
        let public_id = url.slice(url.lastIndexOf("/") + 1, url.lastIndexOf("."))
        return cloudApi.removePhoto(public_id)
        .then((res) => res) 
    },

    removePhoto(countryName, photoId) {
        const userId = this.userId
        return travelApi.removePhoto(userId, countryName, photoId)
    }
}

module.exports = logic