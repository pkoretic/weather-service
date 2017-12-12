module.exports = async (ctx, next) =>
{
    const server_key = process.env.ACCESS_KEY
    const client_key = ctx.query.accessKey

    if (server_key)
    {
        if (!client_key)
            ctx.throw(401, "accessKey is required")

        if (server_key !== client_key)
            ctx.throw(403, "invalid accessKey")
    }

    await next()
}
