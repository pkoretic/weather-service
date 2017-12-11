// set Cache-Control for clients and use in memory caching for responses

const cache = {}

module.exports = function(options = {})
{
    const expire = options.expire || 3600

    return async (ctx, next) =>
    {
        // ignore cache if the client doesn't want it
        const client_header = ctx.header["Cache-Control"]
        if (client_header === "no-cache" || client_header === "no-store" || client_header === "must-revalidate")
            return console.debug("skip cache")

        // cache key - route url to ensure there is no overlap, i.e. forecast?city=Berlin
        const key = ctx.url

        // use cache only for valid GET/HEAD requests
        if (ctx.method === "GET" || ctx.method === "HEAD")
        {
            // check if cache for the rute exists
            const data = cache[key]
            if (data)
            {
                // set respones data to cached data
                ctx.body = data.body

                // send expire time that is actual expire time of the in memory cache
                if (expire)
                {
                    const expires_in = Math.floor(expire - (new Date().getTime() - data.expire) / 1000)
                    ctx.response.set("Cache-Control", `public, max-age=${expires_in}`)
                }

                return
            }
        }

        await next()

        // cache only valid GET/HEAD requests
        if (ctx.method === "GET" || ctx.method === "HEAD" && ctx.status === 200)
        {
            // send expire time for client to use and cache results in memory
            ctx.response.set("Cache-Control", `public, max-age=${expire}`)
            cache[key] =  { body: ctx.body, expire: new Date().getTime() }

            // if expire time is provided clear this route cache after that time
            if (expire)
            {
                setTimeout(() =>
                {
                    delete cache[key]
                },
                expire * 1000)
            }
        }
    }
}
