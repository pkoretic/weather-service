/* eslint max-len: off */

process.env.NODE_ENV = "test"

const chai = require("chai")
const chai_http = require("chai-http")
const server = require("../index")

const should = chai.should()
const expect = chai.expect
chai.use(chai_http)

// ignore errors for self signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

describe("API", () =>
{
    it("should get forecast by city", (done) =>
    {
        chai.request(server)
            .get("/forecast?city=Berlin")
            .end((error, resp) =>
            {
                should.not.exist(error)
                resp.status.should.equal(200)
                resp.body.should.not.be.undefined
                resp.body.should.be.an("object")
                resp.body.should.have.property("sunset")
                resp.body.should.have.property("sunrise")
                resp.body.should.have.property("time")
                resp.body.time.should.be.an("array")
                resp.body.time.every((i) =>
                {
                    expect(i).to.have.all.keys("from", "to", "icon", "temperature", "wind", "humidity", "precipitation", "name")
                    i.from.should.be.an("string")
                    i.to.should.be.an("string")
                    i.icon.should.be.an("string")
                    i.name.should.be.an("string")
                    i.humidity.should.be.an("number")
                    i.temperature.should.be.an("number")
                    i.precipitation.should.be.an("object")
                    i.wind.should.be.an("object")
                })

                done()
            })
    })

    it("should get forecast by latitude, longitude", (done) =>
    {
        chai.request(server)
            .get("/forecast?lat=52.520008&lon=13.404954")
            .end((error, resp) =>
            {
                should.not.exist(error)
                resp.status.should.equal(200)
                resp.body.should.not.be.undefined
                resp.body.should.be.an("object")
                resp.body.should.have.property("sunset")
                resp.body.should.have.property("sunrise")
                resp.body.should.have.property("time")
                resp.body.time.should.be.an("array")
                resp.body.time.every((i) =>
                {
                    expect(i).to.have.all.keys("from", "to", "icon", "temperature", "wind", "humidity", "precipitation", "name")
                    i.from.should.be.an("string")
                    i.to.should.be.an("string")
                    i.icon.should.be.an("string")
                    i.name.should.be.an("string")
                    i.humidity.should.be.an("number")
                    i.temperature.should.be.an("number")
                    i.precipitation.should.be.an("object")
                    i.wind.should.be.an("object")
                })

                done()
            })
    })

    it("should throw error on missing longitude", (done) =>
    {
        chai.request(server)
            .get("/forecast?lat=52.520008")
            .end((error, resp) =>
            {
                should.exist(resp.error)
                expect(resp).to.have.status(400);

                done()
            })
    })

    it("should throw error on missing latitude", (done) =>
    {
        chai.request(server)
            .get("/forecast?lon=13.404954")
            .end((error, resp) =>
            {
                should.exist(resp.error)
                resp.status.should.equal(400)

                done()
            })
    })

    it("should throw error on invalid parameters", (done) =>
    {
        chai.request(server)
            .get("/forecast")
            .end((error, resp) =>
            {
                should.exist(resp.error)
                resp.status.should.equal(400)

                done()
            })
    })
})
