const Router = require("koa-router")
const router = new Router()

// use specified provider, "openweather" by default
const provider = require("../providers/" + (process.env.PROVIDER || "openweather"))

router.get("/forecast", async (ctx) =>
{
    const query = ctx.query
    const city = query.city
    const lat = query.lat
    const lon = query.lon

    // check for valid request
    if (!city && (!lat || !lon))
        return ctx.status = 400

    // on internal errors return 500
    try
    {
        const response = await provider.getForecast(city, lat, lon)
        ctx.body = response
    }
    catch (error)
    {
        console.error(error)
        throw 500
    }
})

module.exports = router
