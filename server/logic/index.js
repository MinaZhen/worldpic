"use strict"

const { mongoose, models: { User, Country, Photo } } = require("data")
const no = "N•_©h€©K!"

const logic = {

    /**
     * Creates a new user in the database
     * 
     * @param {String} username 
     * @param {String} password 
     * @param {String} location 
     * 
     * @throws if not valid params or user already exists
     * 
     * @returns {Promise<Boolean>}
     */
    registerUser(username, password, location) {
        return Promise.resolve()
            .then(() => {
                this._userErrors(no, username, location, password)

                return User.findOne({ username })
            })
            .then((user) => {
                if (user) throw Error(`User named ${username} already exists`)

                return User.create({ username, password, location })
                    .then(() => true)
            })

    },

    /**
     * Authenticate if user exists and returns the id
     * 
     * @param {String} username 
     * @param {String} password 
     * 
     * @throws if not valid params or wrong username or password
     * 
     * @returns {Promise<String>}
     */
    authenticateUser(username, password) {
        return Promise.resolve()
            .then(() => {
                this._userErrors(no, username, no, password)

                return User.findOne({ username, password })
            })
            .then(user => {
                if (!user) throw Error('wrong credentials')

                return user.id
            })
    },
    
    /**
     * Get user selected info
     * 
     * @param {String} userId
     * 
     * @throws if not valid params or user doesn't exists
     * 
     * @returns {Promise<User>} 
     */
    retrieveUser(userId) {
        return Promise.resolve()
            .then(() => {
                this._userErrors(userId, no, no, no)

                return User.findById(userId).select({ _id: 0, username: 1, location: 1, countries: 1 }).populate({ path: 'countries', select: 'name' })
            })
            .then(user => {
                if (!user) throw Error(`no user found with id ${userId}`)

                return user
            })
    },

    /**
     * Delete a user from database
     * 
     * @param {String} userId 
     * @param {String} username 
     * @param {String} password 
     * 
     * @throws if not valid params or wrong parameters
     * 
     * @returns {Promise<Boolean>}
     */
    unregisterUser(userId, username, password) {
        return Promise.resolve()
            .then(() => {
                this._userErrors(userId, username, no, password)

                return User.findOne({ username, password })
            })
            .then((user) => {
                if (!user) throw Error('wrong credentials')

                if (user.id !== userId) throw Error(`no user found with id ${userId} for given credentials`)
                
                return Country.deleteMany({ user: userId })
                .then(() => {
                    return user.remove()
                        .then(() => true)
                })
            })

    },

    /**
     * Get user countries names
     * 
     * @param {String} userId 
     * 
     * @throws if not valid params or not user founded
     * 
     * @returns {Promise<Array.<String>>}
     */
    listVisitedCountries(userId) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, no, no, no, no)

                return User.findById(userId).populate({ path: 'countries', select: 'name' })
                    .then(user => {
                        if (!user) throw Error(`no user found with id ${userId}`)

                        let countries = user.countries.map((v) => v.name)
                        return countries.sort()
                    })
            })
    },

    /**
     * Get specific country info
     * 
     * @param {String} userId 
     * @param {String} countryName 
     * 
     * @throws if not valid params or not user founded
     * 
     * @returns {Promise<Country>}
     */
    retrieveCountry(userId, countryName) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, no, no)

                return User.findById(userId).populate({ path: 'countries', match: { name: { $eq: countryName } } })
            })
            .then(user => {
                if (!user) throw Error(`no user found with id ${userId}`)

                const { countries: [country] } = user

                return country
            })
    },

    /**
     * Adds new photo to a country, if country doesn't exists creates a new one
     * 
     * @param {String} userId 
     * @param {String} name 
     * @param {String} url 
     * 
     * @throws if not valid params or no user founded
     * 
     * @returns {Promise<String>}
     */
    addPhoto(userId, name, url) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, name, no, no, url)

                return User.findById(userId)
            })
            .then(user => {
                if (!user) throw Error(`no user found with id ${userId}`)

                return Country.findOne({ user: userId, name })
                    .then(country => {
                        if (!country) {
                            return Country.create({ user: user._id, name })
                                .then(country => {
                                    user.countries.push(country._id)

                                    return user.save()
                                        .then(() => country)
                                })

                        }
                        return country
                    })
                    .then(country => {
                        if (!country) throw Error('something went wrong')

                        const photo = new Photo({ url })

                        country.photos.push(photo)

                        return country.save()
                            .then(res => {
                                return photo.id
                            })
                    })
            })
    },

    /**
     * Get photo info
     * 
     * @param {String} userId 
     * @param {String} countryName 
     * @param {String} photoId 
     * 
     * @throws if not valid params or no models founded
     * 
     * @returns {Promise<Photo>}
     */
    retrievePhoto(userId, countryName, photoId) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, photoId, no)
                return User.findById(userId).populate({ path: 'countries', match: { name: { $eq: countryName } } })
            })
            .then(user => {
                
                if (!user) throw Error(`no user found with id ${userId}`)

                if (!user.countries.length) throw Error(`no country named ${countryName}, in user ${userId}`)

                const { countries: [country] } = user

                if (!country.photos) throw Error(`no photos found in user ${userId}`)

                const photo = country.photos.id(photoId)

                if (!photo) throw Error(`no photo found with ${photoId} id, in user ${userId}`)

                return photo
            })
    },

    /**
     * Changes photo url
     * 
     * @param {String} userId 
     * @param {String} countryName 
     * @param {String} photoId 
     * @param {String} url 
     * 
     * @throws if not valid params or no models founded
     * 
     * @returns {Promise<Photo>}
     */
    updatePhoto(userId, countryName, photoId, url) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, photoId, url)
                return User.findById(userId).populate({ path: 'countries', match: { name: { $eq: countryName } } })
            })
            .then(user => {
                if (!user) throw Error(`no user found with id ${userId}`)
                if (!user.countries.length) throw Error(`no country named ${countryName}, in user ${userId}`)

                const { countries: [country] } = user
                if (!country.photos) throw Error(`no photos found in user ${userId}`)

                const photo = country.photos.id(photoId)
                if (!photo) throw Error(`no photo found with ${photoId} id, in user ${userId}`)

                photo.url = url
                return country.save()

                    .then((res) => {
                        return true
                    }) 
            })
    },

    /**
     * Deletes a photo from database and if is the last one from a country, removes that Country and its reference on User
     * 
     * @param {String} userId 
     * @param {String} countryName 
     * @param {String} photoId 
     * 
     * @throws if not valid params or no models founded
     * 
     * @returns {Promise<Boolean>}
     */
    removePhoto(userId, countryName, photoId) {
        return Promise.resolve()
            .then(() => {
                this._checkErrors(userId, countryName, no, photoId, no)
                return User.findById(userId).populate({ path: 'countries', match: { name: { $eq: countryName } } })
            })
            .then(user => {
                if (!user) throw Error(`no user found with id ${userId}`)
                if (!user.countries.length) throw Error(`no country named ${countryName}, in user ${userId}`)

                const { countries: [country] } = user
                
                if (!country.photos) throw Error(`no photos found in user ${userId}`)

                const photo = country.photos.id(photoId)
                if (!photo) throw Error(`no photo found with ${photoId} id, in user ${userId}`)

                return Country.findByIdAndUpdate(country.id, { $pull: { photos: { _id: photoId } } }, { new: true })
                    .then((res) => {
                        if (!res) throw Error(`no photo found with ${photoId} id, in ${countryName}`)

                        if (res.photos.length === 0) {
                            return User.findById(userId)
                            .then(user => {
                                const idxC = (user.countries.indexOf(country.id))
                                user.countries.splice(idxC, 1)
                                return user.save()
                                    .then(() => { 
                                        return res.remove() 
                                        .then(() => true)
                                    })
                            })
                        }
                        return true
                    })
                    

            })
    },


    _userErrors(userId, username, password, location) {
        if (userId !== no) {
            if (typeof userId !== 'string') throw Error('User id is not a string')
            if (!(userId = userId.trim()).length) throw Error('User id is empty or blank')
            if (userId.length !== 24) throw Error('User id has a wrong format')
        }
        if (username !== no) {
            if (typeof username !== "string") throw Error("User name is not a string")
            if (!(username = username.trim()).length) throw Error("User name is empty or blank")
        }
        if (password !== no) {
            if (typeof password !== "string") throw Error("User password is not a string")
            if (!(password.trim()).length) throw Error("User password is empty or blank")
        }
        if (location !== no) {
            if (typeof location !== "string") throw Error("User location is not a string")
            if (!(location.trim()).length) throw Error("User location is empty or blank")
        }
    },

    _checkErrors(userId, countryName, countryId, photoId, url) {
        if (userId !== no) {
            if (typeof userId !== 'string') throw Error('User id is not a string')
            if (!(userId = userId.trim()).length) throw Error('User id is empty or blank')
            if (userId.length !== 24) throw Error('User id has a wrong format')
        }
        if (countryName !== no) {
            if (typeof countryName !== "string") throw Error("Country name is not a string")
            if (!(countryName = countryName.trim()).length) throw Error("Country name is empty or blank")
        }
        if (countryId !== no) {
            if (typeof countryId !== 'string') throw Error('Country id is not a string')
            if (!(countryId = countryId.trim()).length) throw Error('Country id is empty or blank')
            if (countryId.length !== 24) throw Error('Country id has a wrong format')
        }
        if (photoId !== no) {
            if (typeof photoId !== 'string') throw Error('Photo id is not a string')
            if (!(photoId = photoId.trim()).length) throw Error('Photo id is empty or blank')
            if (photoId.length !== 24) throw Error('Photo id has a wrong format')
        }
        if (url !== no) {
            if (typeof url !== "string") throw Error("Url is not a string")
            if (!(url.trim()).length) throw Error("Url is empty or blank")
            const rex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
            if (!rex.test(url)) throw Error("Url is not a valid direction")
        }
    }
}
module.exports = logic