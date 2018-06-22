"use strict"

const axios = require("axios")

const no = "N•_©h€©K!"

const travelApi = {
    url: 'NOWHERE',

    token: "NO-TOKEN",

    registerUser(username, password, location) {
        return Promise.resolve()
            .then(() => {
                this._userErrors(no, username, password, location)
                
                return axios.post(`${this.url}/users`, { username, password, location })
                    .then(({ status, data }) => {
                        if (status !== 201 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)
                        
                        return true
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    authenticateUser(username, password) {
        return Promise.resolve()
            .then(() => {
                this._userErrors(no, username, password, no)

                return axios.post(`${this.url}/auth`, { username, password })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        const { data: { id, token } } = data
                        this.token = token
                    

                        return id
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    retrieveUser(userId) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, no, no, no, no)

                return axios.get(`${this.url}/users/${userId}`, { headers: { authorization: `Bearer ${this.token}`}})
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    // updateUser(userId, name, surname, email, password, newEmail, newPassword) {
    //     return Promise.resolve()
    //         .then(() => {
    //             this._validateErrors(true, userId, true, name, true, surname, true, email, true, password, true, newEmail, true, newPassword)

    //             return axios.patch(`${this.url}/users/${userId}`, { userId, name, surname, email, password, newEmail, newPassword })
    //                 .then(({ status, data }) => {
    //                     if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

    //                     return true
    //                 })
    //                 .catch(({ response: { data: { error } } }) => error)
    //         })          
    // },

    unregisterUser(userId, username, password) {
        return Promise.resolve()
            .then(() => {
                this._userErrors(userId, username, password, no)

                return axios.delete(`${this.url}/users/${userId}`, { headers: { authorization: `Bearer ${this.token}` }, data : { userId, username, password }})
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)
                        
                        return true
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    world(userId) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, no, no, no, no)
                
                return axios.get(`${this.url}/users/${userId}/world`, { headers: { authorization: `Bearer ${this.token}`}})
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    retrieveCountry(userId, countryName) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, no, no)

                return axios.get(`${this.url}/users/${userId}/${countryName}`, { headers: { authorization: `Bearer ${this.token}` }})
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    uploadPhoto(file) {
        let formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "sjzufyub")
        
        return axios({
            url: "https://api.cloudinary.com/v1_1/dlpsxhpa0/upload",
            method: "POST",
            headers: {
                "Content-Type" : "application/x-www-form-urlencoded"
            },
            data: formData
        }).then(res => {
            console.log(res)
            return res.data.secure_url
        })
        .catch(err => console.error(err))
    },

    addPhoto(userId, countryName, url) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, no, url)

                return axios.post(`${this.url}/users/${userId}/${countryName}`, { url }, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 201 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                        return data.data.id
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    retrievePhoto(userId, countryName, photoId) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, photoId, no)

                return axios.get(`${this.url}/users/${userId}/${countryName}/${photoId}`, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)
                        
                        const { _id: id, url} = data.data
                        return { id, url } 
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    updatePhoto(userId, countryName, photoId, url) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, photoId, url)

                return axios.patch(`${this.url}/users/${userId}/${countryName}/${photoId}`, { url }, { headers: { authorization: `Bearer ${this.token}` } })
                .then(({ status, data }) => {
                    if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)

                    return true
                })
                .catch(err => {
                    if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                    if (err.response) {
                        const { response: { data: { error: message } } } = err

                        throw Error(message)
                    } else throw err
                })
        })
    },

    removePhoto(userId, countryName, photoId) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, photoId, no)

                return axios.delete(`${this.url}/users/${userId}/${countryName}/${photoId}`, { headers: { authorization: `Bearer ${this.token}` } })
                    .then(({ status, data }) => {
                        if (status !== 200 || data.status !== 'OK') throw Error(`unexpected response status ${status} (${data.status})`)
                        return true
                    })
                    .catch(err => {
                        if (err.code === 'ECONNREFUSED') throw Error('could not reach server')

                        if (err.response) {
                            const { response: { data: { error: message } } } = err

                            throw Error(message)
                        } else throw err
                    })
            })
    },

    _userErrors(userId, username, password, location) {
        if (userId !== no){
            if (typeof userId !== 'string') throw Error('User id is not a string')
            if (!(userId = userId.trim()).length) throw Error('User id is empty or blank')
            if (userId.length !== 24) throw Error('User id has a wrong format')
        }
        if (username !== no){
            if (typeof username !== "string") throw Error("User name is not a string")
            if (!(username = username.trim()).length) throw Error("User name is empty or blank")
        }
        if (password !== no){ 
            if (typeof password !== "string") throw Error("User password is not a string")
            if (!(password.trim()).length) throw Error("User password is empty or blank")
        }
        if (location !== no){
            if (typeof location !== "string") throw Error("User location is not a string")
            if (!(location.trim()).length) throw Error("User location is empty or blank")
        }
    },

    _checkErrors(userId, countryName, countryId, photoId, url) {
        if (userId !== no){
            if (typeof userId !== 'string') throw Error('User id is not a string')
            if (!(userId = userId.trim()).length) throw Error('User id is empty or blank')
            if (userId.length !== 24) throw Error('User id has a wrong format')
        }
        if (countryName !== no){
            if (typeof countryName !== "string") throw Error("Country name is not a string")
            if (!(countryName = countryName.trim()).length) throw Error("Country name is empty or blank")
        }
        if (countryId !== no){
            if (typeof countryId !== 'string') throw Error('Country id is not a string')
            if (!(countryId = countryId.trim()).length) throw Error('Country id is empty or blank')
            if (countryId.length !== 24) throw Error('Country id has a wrong format')
        }
        if (photoId !== no){
            if (typeof photoId !== 'string') throw Error('Photo id is not a string')
            if (!(photoId = photoId.trim()).length) throw Error('Photo id is empty or blank')
            if (photoId.length !== 24) throw Error('Photo id has a wrong format')
        }
        if (url !== no){ 
            if (typeof url !== "string") throw Error("Url is not a string")
            if (!(url.trim()).length) throw Error("Url is empty or blank")
            const rex  = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
            if (!rex.test(url)) throw Error ("Url is not a valid direction")
        }
    }
}

module.exports = travelApi