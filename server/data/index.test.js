"use strict"

require("dotenv").config()

const { mongoose, models: { User, Country, Photo }} = require(".")
const expect = require("expect")

const { env: { DB_URL }} = process

describe("models", () => {
    const userData = { username: "JohnDoe", password: "123", location: "EUA" }
    before(() => mongoose.connect(DB_URL))

    beforeEach(() => Promise.all([User.remove(), Country.deleteMany(), Photo.deleteMany()]))

    describe("create different models", () => {

        it("should succeed creating a new user", () => {
            const user = new User(userData)
            
            return user.save()
                .then(user => {
                    expect(user).toBeDefined()
                    expect(user.username).toBe("JohnDoe")
                    expect(user.password).toBe("123")
                    expect(user.location).toBe("EUA")
                })
        })

        it("should succeed assigning two countries to a user", () => 
            User.create(userData)
                .then((user) => {
                    const japan = new Country({ name : "Japan", user: user._id,  })
                    const peru = new Country({ name : "Peru", user: user._id,  })
                    return Promise.all([japan, peru])
                    .then((p) => {
                        p.map((v, i) => {
                            v.save()
                            return user.countries.push(v._id)
                        })

                        expect(p[0].id).not.toBe(p[1].id)
                        expect(p[0].user).toBe(p[1].user)

                        return user.save()
                    }).then(res => {
                        const uc = user.countries
                        expect(uc.length).toBe(2)

                        expect(uc[0]._id).not.toBe(uc[1]._id)
                        const c01 = Country.findById(uc[0])
                        const c02 = Country.findById(uc[1])

                        return Promise.all([c01, c02])
                        .then(res => {
                            expect(res[0].user).toEqual(res[1].user)
                            expect(res[0].name).not.toBe(res[1].name)
                            expect(res[0].id).not.toBe(res[1].id)
                            expect(res[0]._id).not.toBe(res[1]._id)
                            expect((res[0].name === "Japan")||(res[0].name === "Peru")).toBeTruthy()
                            expect((res[1].name === "Japan")||(res[1].name === "Peru")).toBeTruthy()
                        })
                    })
                    
                })
        )

        it("should succeed adding a photo to a country into a user", () => 
            User.create(userData)
                .then((user) => {   
                    const _url = "http://en.toureast.com/portals/0/img/country/japan/japan_header.jpg" 
                    const photo = new Photo({ url: _url})         
                    const place = Country.create({ name : "Japan", user: user._id })
                    return Promise.all([photo, place])
                    .then((promises) => {
                        let ph = "", c = ""
                        if(promises[0].url){ ph = promises[0]; c = promises[1]
                        } else { ph = promises[1]; c = promises[0]}
                        c.photos.push(ph)
                        return c.save()
                        .then((cntry) => {
                            user.countries.push(cntry._id)

                            return user.save()
                        })
                        .then(() => {
                            const uc = user.countries
                            expect(uc.length).toBe(1)
                            return Country.findById({ _id : uc[0] })  
                        })
                        .then((cp0) => {
                            const uc0 = cp0.photos[0]
                            expect(cp0.photos.length).toBe(1)

                            expect(cp0.user.toString()).toBe(user.id)
                            expect(typeof cp0.id).toBe("string")
                            expect(cp0.name).toBe("Japan")

                            expect(typeof uc0.id).toBe("string")
                            expect(uc0.url).toBe(_url)
                        })
                    })
                })
        )
    })
    after(done => mongoose.connection.db.dropDatabase(() => mongoose.connection.close(done)) )
})