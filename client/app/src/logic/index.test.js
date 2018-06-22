"use strict"

const { expect } = require("chai")
const logic = require(".")
const travelApi = require("api")

describe("logic (top10travels-app)", () => {
    const userData = { username: "JohnDoe", password: "123", location: "EUA" }
    const { username, password, location } = userData
    const dUrl = "http://en.toureast.com/portals/0/img/country/japan/japan_header.jpg"
    const dUrl2 = "https://www.roughguides.com/wp-content/uploads/2012/08/128040751-e1353429509474-660x420.jpg"

    beforeEach(done => {
        const { username, password } = userData

        travelApi.authenticateUser(username, password)
            .then(userId =>
                travelApi.unregisterUser(userId, username, password)
            )
            .then(() => done())
            .catch(() => done())
    })
    describe("# Users", () => { //find other user
        false && describe("register", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then(res => {
                        expect(res).to.be.true
                        return (logic.login(username, password))
                            .then(res => {
                                expect(res).to.be.true
    
                                expect(logic.userId).not.to.equal("NO-ID")
                            })
                    })
            )
        })
    
        false && describe("login", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then((res) => {
                        return logic.login(username, password)
                    })
                    .then(res => {
                        expect(res).to.be.true
    
                        expect(logic.userId).not.to.equal("NO-ID")
                    })
            )
        })
    
        false && describe("retrieve user", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.retrieveUser())
                    .then(res => {
                        expect(res).to.exist
                        expect(res.username).to.equal("JohnDoe")
                        expect(res.location).to.equal("EUA")
                        expect(logic.userId).not.to.equal("NO-ID")
                    })
            )
        })
    
        describe("unregister user", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.unregister(username, password))
                    .then(res => {
                        expect(res).to.be.true
                        expect(logic.userId).to.equal("NO-ID")
                    })
            )
            it("should also remove assigned countries", () =>
            logic.registerUser(username, password, location)
                .then(() => logic.login(username, password))
                .then(() => logic.addPhoto("Japan", dUrl))
                .then(() => logic.addPhoto("Japan", dUrl2))
                .then(() => logic.addPhoto("Russia", dUrl))
                .then(() => logic.addPhoto("Mexico", dUrl))
                .then(() => logic.world())
                .then(res => {
                    expect(res).to.exist
                    expect(res.length).to.equal(3)
                    const p1 = Promise.resolve(logic.unregister(username, password))  
                    p1.then(x => {
                        expect(x).to.be.true
                        expect(logic.userId).to.equal("NO-ID")
                    })
                    
                })
                
            )
        })
    })
    false && describe("# World map", () => { //check other user
        describe("list visited countries", () => {
            it("should succeed on correct data without countries", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.world())
                    .then(res => {
                        expect(res).to.exist
                        expect(res.length).to.equal(0)
                    })
            )
    
            it("should return visited countries", () =>
            logic.registerUser(username, password, location)
                .then(() => logic.login(username, password))
                .then(() => logic.addPhoto("Japan", dUrl))
                .then(() => logic.addPhoto("Japan", dUrl2))
                .then(() => logic.addPhoto("Russia", dUrl))
                .then(() => logic.addPhoto("Mexico", dUrl))
                .then(() => logic.world())
                .then(res => {
                    expect(res).to.exist
                    expect(res.length).to.equal(3)
                    expect(res[0]).to.equal("Japan")
                    expect(res[1]).to.equal("Mexico")
                    expect(res[2]).to.equal("Russia")
                })
            )
        })
    })
    false && describe("# Country", () => { //check other user
        describe("retrieve country", () => {
            it("should succeed without country created", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.retrieveCountry("Japan"))
                    .then((res) => {
                        expect(res).to.be.undefined
                        expect(res).not.to.exist
                        expect(travelApi.token).not.to.equal('NO-TOKEN')
                    })
            )
    
            it("should return country information", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.addPhoto("Japan", dUrl))
                    .then(() => logic.addPhoto("Japan", dUrl2))
                    .then(() => logic.retrieveCountry("Japan"))
                    .then((res) => {
                        expect(res).to.exist
                        expect(res._id).not.to.be.undefined
                        expect(res.user).not.to.be.undefined
                        expect(res.name).to.equal("Japan")
                        
                        expect(res.photos.length).to.equal(2)
                        
                        expect(res.photos[0]._id).not.to.be.undefined
                        expect((res.photos[0].url === dUrl)||(res.photos[0].url === dUrl2)).to.be.true
                        expect(res.photos[0]._id).not.to.equal(res.photos[1]._id)
                        expect(res.photos[1]._id).not.to.be.undefined
                        expect((res.photos[1].url === dUrl)||(res.photos[1].url === dUrl2)).to.be.true
    
                        expect(travelApi.token).not.to.equal('NO-TOKEN')
                    })
            )
        })      
    })

    false && describe("# Photos", () => {
        describe("add photo", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then((x) => logic.login(username, password))
                    .then((x) => logic.addPhoto("Japan", dUrl))
                    .then((id) => {
                        expect(id).to.exist
                        return logic.retrieveUser()
                            .then(res => {
                                expect(res).to.exist
                                expect(res.username).to.equal("JohnDoe")
                                expect(res.location).to.equal("EUA")
                                expect(res.countries.length).to.equal(1)
                                expect(logic.userId).not.to.equal("NO-ID")
                            })
                    })
            )
        })

        describe("retrieve photo", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.addPhoto("Japan", dUrl))
                    .then((id) => {
                        expect(id).to.exist
                        return logic.retrievePhoto("Japan", id)
                            .then(res => {
                                expect(res).to.exist
                                expect(res.id).to.exist
                                expect(res.url).to.equal(dUrl)
                                expect(logic.userId).not.to.equal("NO-ID")
                            })
                    })
            )
        })

        describe("update photo", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.addPhoto("Japan", dUrl))
                    .then((id) => {
                        expect(id).to.exist
                        return logic.updatePhoto("Japan", id, dUrl2)
                            .then(ok => {
                                expect(ok).to.be.true
                                return logic.retrievePhoto("Japan", id)
                            })
                            .then(res => {
                                expect(res).to.exist
                                expect(res.id).to.exist
                                expect(res.url).to.equal(dUrl2)
                                expect(logic.userId).not.to.equal("NO-ID")
                            })
                    })
            )
        })

        describe("remove photo", () => {
            it("should succeed on correct data", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.addPhoto("Japan", dUrl))
                    .then((id) => {
                        expect(id).to.exist
                        return logic.removePhoto("Japan", id)
                            .then(res => {
                                expect(res).to.be.true
                                expect(logic.userId).not.to.equal("NO-ID")
                                return logic.retrievePhoto("Japan", id)
                            })
                            .catch(({ message }) => expect(message).to.equal(`no country named Japan, in user ${logic.userId}`))
                    })
            )
            it("should succeed and delete 1 of 5 countries", () =>
                logic.registerUser(username, password, location)
                    .then(() => logic.login(username, password))
                    .then(() => logic.addPhoto("Japan", dUrl))
                    .then(() => logic.addPhoto("Corea", dUrl))
                    .then(() => logic.addPhoto("Spain", dUrl))
                    .then((id) => {
                        expect(id).to.exist
                        return logic.addPhoto("Russia", dUrl)
                        .then(() => logic.addPhoto("Chile", dUrl))
                    
                        .then(() => logic.removePhoto("Spain", id))
                            .then(res => {
                                expect(res).to.be.true
                                expect(logic.userId).not.to.equal("NO-ID")
                                return logic.retrieveUser(logic.userId)                                
                            })
                            .then(({countries}) => {
                                expect(countries.length).to.equal(4)
                                countries.forEach(country => { expect(country.name).not.equal("Spain")})
                                return logic.world(logic.userId)
                            })
                            .then((countries) => {
                                expect(countries.length).to.equal(4)
                                countries.forEach(country => { expect(country).not.equal("Spain")})
                                return logic.retrievePhoto("Spain", id)
                            })
                            
                            .catch(({ message }) => expect(message).to.equal(`no country named Spain, in user ${logic.userId}`))
                            
                    })
            )
        })

    })
})