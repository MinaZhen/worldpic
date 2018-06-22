"use strict"

require("dotenv").config()

const { mongoose, models: { User, Country, Photo } } = require("data")
const logic = require(".")
const { expect } = require("chai")

const { env: { DB_URL } } = process

describe("logic (project-server)", () => {
    const userData = { username: "JohnDoe", password: "123", location: "EUA" }
    const { username, password, location } = userData
    const fakeId = "123456781234567812345678"
    const dUrl = "http://en.toureast.com/portals/0/img/country/japan/japan_header.jpg"
    const dUrl2 = "https://www.roughguides.com/wp-content/uploads/2012/08/128040751-e1353429509474-660x420.jpg"

    before(() => mongoose.connect(DB_URL))

    beforeEach(() => Promise.all([User.remove(), Country.deleteMany(), Photo.deleteMany()]))

    describe("# User", () => {
        describe("register user -> (username, password, location)", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then(res => expect(res).to.be.true)
            )
            describe("errors", () => {
                it("should throw error if user already exists", () =>
                    User.create(userData)
                        .then(() => logic.registerUser(username, password, location))
                        .catch(({ message }) => expect(message).to.equal(`User named ${username} already exists`))
                )
            })
        })

        describe("authenticate user -> (username, password)", () => {
            it("should succeed on correct data", () =>
                User.create(userData)
                    .then(() =>
                        logic.authenticateUser(username, password)
                            .then(id => expect(id).to.exist)
                    )
            )
            describe("errors", () => {
                it("should fail on wrong username", () =>
                    User.create(userData)
                        .then(() =>
                            logic.authenticateUser("Batman", password)
                                .catch(({ message }) => expect(message).to.equal("wrong credentials"))
                        )
                )

                it("should fail on wrong password", () =>
                    User.create(userData)
                        .then(() =>
                            logic.authenticateUser(username, "wrong-password")
                                .catch(({ message }) => expect(message).to.equal("wrong credentials"))
                        )
                )
            })
        })

        describe("retrieve user -> (user)", () => {
            it("should succeed without countries", () =>
                User.create(userData)
                    .then(({ id }) => {
                        return logic.retrieveUser(id)
                    })
                    .then(user => {
                        expect(user).to.exist

                        const { _id, username, password, location, countries } = user

                        expect(username).to.equal("JohnDoe")
                        expect(location).to.equal("EUA")

                        expect(_id).to.be.undefined
                        expect(password).to.be.undefined
                        expect(countries).to.exist
                        expect(countries.length).to.equal(0)
                    })
            )
            it("should succeed with 5 countries", () =>
                User.create(userData)
                    .then((user) => {
                        const p1 = Country.create({ name: "Japan", user: user.id })
                        const p2 = Country.create({ name: "Mexico", user: user.id })
                        const p3 = Country.create({ name: "Kenya", user: user.id })
                        const p4 = Country.create({ name: "Turkey", user: user.id })
                        const p5 = Country.create({ name: "Afghanistan", user: user.id })
                        return Promise.all([p1, p2, p3, p4, p5])
                            .then(countries => {
                                countries.map(country => user.countries.push(country._id))

                                return user.save()
                            })
                            .then(() => {
                                return logic.retrieveUser(user.id)
                            })
                            .then(user => {
                                expect(user).to.exist

                                const { _id, username, password, location, countries } = user

                                expect(username).to.equal("JohnDoe")
                                expect(location).to.equal("EUA")

                                expect(_id).to.be.undefined
                                expect(password).to.be.undefined

                                expect(countries).to.exist
                                expect(countries.length).to.equal(5)

                                const arr = countries.sort((a, b) => {
                                    if (a.name < b.name) return -1;
                                    if (a.name > b.name) return 1;
                                    return 0;
                                })
                                expect(arr[0].name).to.equal("Afghanistan")
                                expect(arr[1].name).to.equal("Japan")
                                expect(arr[2].name).to.equal("Kenya")
                                expect(arr[3].name).to.equal("Mexico")
                                expect(arr[4].name).to.equal("Turkey")
                            })
                    })
            )
            describe("errors", () => {
                it("should fail on wrong user id", () =>
                    logic.retrieveUser(fakeId)
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${fakeId}`))
                )
            })


        })

        describe('unregister user', () => {
            it('should succeed on correct data', () =>
                User.create(userData)
                    .then(({ id }) => {
                        return logic.unregisterUser(id, username, password)
                            .then(res => {
                                expect(res).to.be.true

                                return User.findById(id)
                            })
                            .then(user => {
                                expect(user).to.be.null
                            })
                    })
            )

            it('should also remove assigned countries', () =>
                User.create(userData)
                    .then((user) => {
                        
                        const p1 = Country.create({ name: "Japan", user: user.id })
                        const p2 = Country.create({ name: "Mexico", user: user.id })
                        const p3 = Country.create({ name: "Kenya", user: user.id })
                        const p4 = Country.create({ name: "Turkey", user: user.id })
                        const p5 = Country.create({ name: "Afghanistan", user: user.id })
                        return Promise.all([p1, p2, p3, p4, p5])
                        .then(countries => {
                            countries.map(country => user.countries.push(country._id))

                            return user.save()
                        })
                        .then(() => User.findById(user.id))
                        .then((u) => {
                            expect(u.countries.length).to.equal(5)
                            return Country.find({ user: user.id}) 
                        })
                        .then(arr =>{
                            const idx = user.id
                            expect(arr.length).to.equal(5)
                            return logic.unregisterUser(user.id, username, password)
                                .then(res => {
                                    expect(res).to.be.true
                                    return User.findById(user.id)
                                })
                                .then(user => {
                                    expect(user).to.be.null
                                    return Country.find()
                                })
                                .then(res => {expect(res.length).to.equal(0)})
                        
                        })
                    })
            )
            describe("errors", () => {
                it("should fail on invented user id", () =>
                    logic.unregisterUser(fakeId, username, password)
                        .catch(({ message }) => expect(message).to.equal("wrong credentials"))
                )
                it("should fail on wrong user id", () => {
                    return User.create(userData)
                        .then((user) => {
                            let { id } = user

                            return logic.unregisterUser(fakeId, username, password)
                                .catch(({ message }) => expect(message).to.equal(`no user found with id ${fakeId} for given credentials`))
                        })
                })
            })
        })
    })

    describe("# Countries", () => {
        describe('get visited countries', () => {
            it("should succeed with 5 countries", () =>
                User.create(userData)
                    .then((user) => {
                        const p1 = Country.create({ name: "Japan", user: user.id })
                        const p2 = Country.create({ name: "Mexico", user: user.id })
                        const p3 = Country.create({ name: "Kenya", user: user.id })
                        const p4 = Country.create({ name: "Turkey", user: user.id })
                        const p5 = Country.create({ name: "Afghanistan", user: user.id })
                        return Promise.all([p1, p2, p3, p4, p5])
                            .then(countries => {
                                countries.map(country => user.countries.push(country._id))

                                return user.save()
                            })
                            .then(() => {
                                return logic.listVisitedCountries(user.id)
                                    .then(map => {
                                        expect(map).to.exist
                                        expect(map.length).to.equal(5)
                                        expect(map[0]).to.equal("Afghanistan")
                                        expect(map[1]).to.equal("Japan")
                                        expect(map[2]).to.equal("Kenya")
                                        expect(map[3]).to.equal("Mexico")
                                        expect(map[4]).to.equal("Turkey")
                                    })
                            })
                    })
            )

            it("world map should succeed without countries", () =>
                User.create(userData)
                    .then(({ id }) => {
                        return logic.listVisitedCountries(id)
                            .then(map => {
                                expect(map).to.exist
                                expect(map.length).to.equal(0)
                            })
                    })
            )
        })

        describe('retrieve country', () => {
            it("retrieve country should succeed and return it with 5 photos", () => {
                const dUrl3 = "https://cdn.tourradar.com/s3/tour/original/96639_55939865.jpg"
                const dUrl4 = "http://www.travelcaffeine.com/wp-content/uploads/2017/01/woman-path-philosophers-walk-cherry-blossom-sakura-season-kyoto-japan-bricker.jpg"
                const dUrl5 = "https://www.overseasattractions.com/wp-content/uploads/2015/03/Ghibli-Museum-1.jpg"

                return User.create(userData)
                    .then((user) => {
                        return Country.create({ name: "Japan", user: user.id })
                            .then(country => {
                                user.countries.push(country._id)

                                return user.save()
                                    .then(() => {
                                        country.photos.push(new Photo({ url: dUrl }))
                                        country.photos.push(new Photo({ url: dUrl2 }))
                                        country.photos.push(new Photo({ url: dUrl3 }))
                                        country.photos.push(new Photo({ url: dUrl4 }))
                                        country.photos.push(new Photo({ url: dUrl5 }))

                                        return country.save()
                                            .then(() => logic.retrieveCountry(user.id, country.name))
                                            .then((res) => {
                                                expect(res).to.exist
                                                expect(res.photos.length).to.equal(5)

                                                const arr = res.photos.sort((a, b) => {
                                                    if (a.url < b.url) return -1;
                                                    if (a.url > b.url) return 1;
                                                    return 0;
                                                })

                                                expect(arr[0].url).to.equal(dUrl)
                                                expect(arr[1].url).to.equal(dUrl4)
                                                expect(arr[2].url).to.equal(dUrl3)
                                                expect(arr[3].url).to.equal(dUrl5)
                                                expect(arr[4].url).to.equal(dUrl2)
                                            })
                                    })
                            })

                    })
            })

            it("retrieve country should succeed if country has not photos", () => {
                return User.create(userData)
                    .then(({ id }) => logic.retrieveCountry(id, "Japan"))
                    .then(res => expect(res).not.to.exist)
            })
        })

    })


    describe("# Photos", () => {
        describe("add photo -> (user_id, country_name, password)", () => {
            it("should succeed on correct data and create country", () =>
                User.create(userData)
                    .then(({ id }) =>
                        logic.addPhoto(id, "Japan", dUrl)
                            .then(id => expect(id).to.exist)
                    )
            )

            it("should succeed with country already created", () =>
                User.create(userData)
                    .then((user) => {
                        return new Country({ name: "Japan", user: user._id }).save()
                            .then(country => {
                                user.countries.push(country._id)

                                return user.save()
                                    .then(user => {
                                        country.photos.push(new Photo({ url: dUrl }))

                                        return country.save()
                                    })
                            })
                            .then(() => logic.addPhoto(user.id, "Japan", dUrl2))
                            .then(pId => {
                                expect(pId).to.exist
                                expect(typeof pId).to.equal("string")

                                return User.findById(user.id)
                                    .then(user => {
                                        expect(user.countries.length).to.equal(1)

                                        return Country.findById(user.countries[0]._id.toString())
                                            .then(country => {
                                                expect(country.photos.length).to.equal(2)
                                            })
                                    })
                            })
                    })
            )

            describe("errors", () => {
                it("should fail on wrong user id", () =>
                    logic.addPhoto(fakeId, "Japan", dUrl)
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${fakeId}`))
                )

                it("should fail on wrong url format", () =>
                    logic.addPhoto(fakeId, "Japan", "wrong-format")
                        .catch(({ message }) => expect(message).to.equal("Url is not a valid direction"))
                )
            })
        })

        describe("retrieve photo -> (user_id, country_name, photo_id)", () => {
            it("should succeed on correct data", () =>
                User.create(userData)
                    .then((user) => {
                        return Country.create({ name: "Japan", user: user._id })
                            .then(country => {
                                user.countries.push(country._id)
                                return user.save()
                                    .then(() => Photo.create({ url: dUrl }))
                                    .then(ph => {
                                        country.photos.push(ph)
                                        expect(ph.id).to.exist
                                        expect(ph.url).to.equal(dUrl)
                                        return country.save()
                                            .then(() => logic.retrievePhoto(user.id, country.name, ph.id))
                                            .then((res) => {
                                                expect(res).to.exist
                                                expect(res.id).to.exist
                                                expect(res.url).to.equal(dUrl)
                                            })
                                    })
                            })

                    })
            )
            describe("errors", () => {
                it("should fail on wrong user id", () =>
                    logic.retrievePhoto(fakeId, fakeId, fakeId, dUrl)
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${fakeId}`))
                )


                it("should fail on wrong country name", () =>
                    User.create(userData)
                        .then((user) =>
                            logic.retrievePhoto(user.id, "fake", fakeId, dUrl)
                                .catch(({ message }) => expect(message).to.equal(`no country named fake, in user ${user.id}`))
                        )
                )

                it("should fail on wrong photo id", () =>
                    User.create(userData)
                        .then((user) => {
                            return Country.create({ name: "Japan", user: user.id })
                                .then(country => {
                                    user.countries.push(country._id)

                                    return user.save()
                                        .then(user => {
                                            country.photos.push(new Photo({ url: dUrl }))
                                            return country.save()
                                                .then(() => logic.retrievePhoto(user.id, "Japan", fakeId, dUrl2))
                                                .catch(({ message }) => expect(message).to.equal(`no photo found with ${fakeId} id, in user ${user.id}`))
                                        })
                                })
                        })
                )
            })
        })

        describe("update photo -> (user_id, country_name, photo_id, url2change)", () => {
            it("should succeed on correct data", () =>
                User.create(userData)
                    .then((user) => {
                        return Country.create({ name: "Japan", user: user._id })
                            .then(country => {
                                user.countries.push(country._id)
                                return user.save()
                                    .then(() => Photo.create({ url: dUrl }))
                                    .then(ph => {
                                        country.photos.push(ph)
                                        expect(ph.id).to.exist
                                        expect(ph.url).to.equal(dUrl)
                                        return country.save()
                                            .then(() => logic.updatePhoto(user.id, country.name, ph.id, dUrl2))
                                            .then((res) => {
                                                expect(res).to.be.true
                                                return Country.findById(country.id)
                                                    .then((res) => {
                                                        expect(res.photos[0].id).to.equal(ph.id)
                                                        expect(res.photos[0].url).not.to.equal(ph.url)
                                                        expect(res.photos[0].url).to.equal(dUrl2)

                                                        let phot = res.photos.id(ph.id)
                                                        expect(phot.id).to.equal(ph.id)
                                                        expect(phot.url).not.to.equal(ph.url)
                                                        expect(phot.url).to.equal(dUrl2)
                                                    })

                                            })
                                    })
                            })

                    })
            )
            describe("errors", () => {
                it("should fail on wrong user id", () =>
                    logic.updatePhoto(fakeId, fakeId, fakeId, dUrl)
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${fakeId}`))
                )


                it("should fail on wrong country name", () =>
                    User.create(userData)
                        .then((user) =>
                            logic.updatePhoto(user.id, "fake", fakeId, dUrl)
                                .catch(({ message }) => expect(message).to.equal(`no country named fake, in user ${user.id}`))
                        )
                )

                it("should fail on wrong photo id", () =>
                    User.create(userData)
                        .then((user) => {
                            return Country.create({ name: "Japan", user: user.id })
                                .then(country => {
                                    user.countries.push(country._id)
                                    return user.save()
                                        .then(() => Photo.create({ url: dUrl }))
                                        .then(ph => {
                                            country.photos.push(ph)
                                            return country.save()
                                                .then(() => logic.updatePhoto(user.id, "Japan", fakeId, dUrl2))
                                                .catch(({ message }) => expect(message).to.equal(`no photo found with ${fakeId} id, in user ${user.id}`))
                                        })
                                })
                        })
                )
            })
        })

        describe("remove photo -> (user_id, country_name, photo_id)", () => {
            it("should succeed on correct data and deleting just one photo", () =>
                User.create(userData)
                    .then((user) => {
                        return Country.create({ name: "Japan", user: user._id })
                            .then(country => {
                                user.countries.push(country._id)
                                return user.save()
                                    .then(() => {
                                        const p1 = Photo.create({ url: dUrl })
                                        const p2 = Photo.create({ url: dUrl2 })
                                        return Promise.all([p1, p2])
                                    })
                                    .then(promises => {
                                        promises.map((v) => country.photos.push(v))
                                        expect(country.photos.length).to.equal(2)
                                        const ph = country.photos[0]
                                        return country.save()
                                            .then(() => logic.removePhoto(user.id, country.name, ph.id))
                                            .then((res) => {
                                                expect(res).to.be.true
                                                return Country.findById(country.id)
                                                    .then((res) => {
                                                        expect(res.photos.length).to.equal(1)
                                                        let phot = res.photos.id(ph.id)
                                                        expect(phot).to.be.null
                                                    })

                                            })
                                    })
                            })

                    })
            )

            it("should succeed deleting the last photo and removing 'empty' country", () =>
                User.create(userData)
                    .then((user) => {
                        return Country.create({ name: "Japan", user: user._id })
                            .then(country => {
                                user.countries.push(country._id)
                                return user.save()
                                    .then(() => Photo.create({ url: dUrl }))
                                    .then(photo => {
                                        country.photos.push(photo)
                                        expect(country.photos.length).to.equal(1)
                                        return country.save()
                                            .then(() => logic.removePhoto(user.id, country.name, photo.id))
                                            .then((res) => {
                                                expect(res).to.be.true
                                                return Country.findById(country.id)
                                                    .then((res) => {
                                                        expect(res).to.be.null
                                                        return User.findById(user.id)
                                                            .then((u) => {
                                                                expect(u.countries.length).to.equal(0)
                                                            })
                                                    })
                                            })
                                    })
                            })

                    })
            )

            it("should succeed removing 1 of 5 countries", () =>
                User.create(userData)
                    .then((user) => {
                        const p1 = Country.create({ name: "Japan", user: user.id })
                        const p2 = Country.create({ name: "Mexico", user: user.id })
                        const p3 = Country.create({ name: "Kenya", user: user.id })
                        const p4 = Country.create({ name: "Turkey", user: user.id })
                        const p5 = Country.create({ name: "Afghanistan", user: user.id })
                        return Promise.all([p1, p2, p3, p4, p5])
                            .then(countries => {
                                countries.map(country => user.countries.push(country._id))

                                return user.save()
                                .then(() => Photo.create({ url: dUrl }))
                                        .then(photo => {
                                            const country = countries[2]
                                            country.photos.push(photo)
                                            expect(country.photos.length).to.equal(1)
                                            return country.save()
                                                .then(() => logic.removePhoto(user.id, country.name, photo.id))
                                                .then((res) => {
                                                    expect(res).to.be.true
                                                    return Country.findById(country.id)
                                                        .then((res) => {
                                                            expect(res).to.be.null
                                                            return User.findById(user.id)
                                                                .then((u) => {
                                                                    expect(u.countries.length).to.equal(4)
                                                                    u.countries.forEach((v) => {
                                                                        expect(v.toString()).not.equal(country.id)
                                                                    })
                                                                })
                                                        })
                                                })
                                        })
                            })
                    })
            )

            describe("errors", () => {
                it("should fail on wrong user id", () =>
                    logic.removePhoto(fakeId, "Japan", fakeId, dUrl)
                        .catch(({ message }) => expect(message).to.equal(`no user found with id ${fakeId}`))
                )


                it("should fail on wrong country name", () =>
                    User.create(userData)
                        .then((user) =>
                            logic.removePhoto(user.id, "Japan", fakeId, dUrl)
                                .catch(({ message }) => expect(message).to.equal(`no country named Japan, in user ${user.id}`))
                        )
                )

                it("should fail on wrong photo id", () =>
                    User.create(userData)
                        .then((user) => {
                            return Country.create({ name: "Japan", user: user.id })
                                .then(country => {
                                    user.countries.push(country._id)
                                    return user.save()
                                        .then(() => Photo.create({ url: dUrl }))
                                        .then(ph => {
                                            country.photos.push(ph)
                                            return country.save()
                                                .then(() => logic.removePhoto(user.id, "Japan", fakeId, dUrl2))
                                                .catch(({ message }) => expect(message).to.equal(`no photo found with ${fakeId} id, in user ${user.id}`))
                                        })
                                })
                        })
                )
            })
        })
    })




    // after(done => mongoose.connection.close(done))
    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)))
})
