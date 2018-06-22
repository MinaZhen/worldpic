const express = require('express')
const bodyParser = require('body-parser')
const logic = require('logic')
const jwt = require('jsonwebtoken')
const jwtValidation = require('./utils/jwt-validation')

const router = express.Router()

const { env: { TOKEN_SECRET, TOKEN_EXP } } = process

const jwtValidator = jwtValidation(TOKEN_SECRET)

const jsonBodyParser = bodyParser.json()

router.post('/users', jsonBodyParser, (req, res) => {
    const { body: { username, password, location } } = req

    logic.registerUser(username, password, location)
        .then(() => {
            res.status(201)
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.post('/auth', jsonBodyParser, (req, res) => {
    const { body: { username, password } } = req

    logic.authenticateUser(username, password)
        .then(id => {
            const token = jwt.sign({ id }, TOKEN_SECRET, { expiresIn: TOKEN_EXP })

            res.json({ status: 'OK', data: { id, token } })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId', jwtValidator, (req, res) => {
    const { params: { userId } } = req

    return logic.retrieveUser(userId)
        .then(user => {
            res.json({ status: 'OK', data: user })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })

})

// router.patch('/users/:userId', [jwtValidator, jsonBodyParser], (req, res) => {
//     const { params: { userId }, body: { name, surname, email, password, newEmail, newPassword } } = req

//     logic.updateUser(userId, name, surname, email, password, newEmail, newPassword)
//         .then(() => {
//             res.json({ status: 'OK' })
//         })
//         .catch(({ message }) => {
//             res.status(400)
//             res.json({ status: 'KO', error: message })
//         })
// })


router.delete('/users/:userId', [jwtValidator, jsonBodyParser], (req, res) => {
    const { params: { userId }, body: { username, password } } = req

    logic.unregisterUser(userId, username, password)
        .then(() => {
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId/world', jwtValidator, (req, res) => {
    const { params: { userId } } = req

    logic.listVisitedCountries(userId)
        .then(list => {
            res.json({ status: 'OK', data: list })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId/:countryName', jwtValidator, (req, res) => {
    const { params: { userId, countryName } } = req

    logic.retrieveCountry(userId, countryName)
        .then((country) => {
            res.json({ status: 'OK', data: country })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.post('/users/:userId/:countryName', [jwtValidator, jsonBodyParser], (req, res) => {
    const { params: { userId, countryName }, body: { url } } = req

    logic.addPhoto(userId, countryName, url)
        .then(id => {
            res.status(201)
            res.json({ status: 'OK', data: { id } })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.get('/users/:userId/:countryName/:photoId', jwtValidator, (req, res) => {
    const { params: { userId, countryName, photoId } } = req

    logic.retrievePhoto(userId, countryName, photoId)
        .then(photo => {
            res.json({ status: 'OK', data: photo })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.patch('/users/:userId/:countryName/:photoId', [jwtValidator, jsonBodyParser], (req, res) => {
    const { params: { userId, countryName, photoId }, body: { url } } = req

    logic.updatePhoto(userId, countryName, photoId, url)
        .then(() => {
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})

router.delete('/users/:userId/:countryName/:photoId', jwtValidator, (req, res) => {
    const { params: { userId, countryName, photoId } } = req

    logic.removePhoto(userId, countryName, photoId)
        .then(() => {
            res.json({ status: 'OK' })
        })
        .catch(({ message }) => {
            res.status(400)
            res.json({ status: 'KO', error: message })
        })
})


module.exports = router