const fs = require("fs")
const conditional = require("koa-conditional-get")
const compress = require("koa-compress")
const etag = require("koa-etag")
const serve = require("koa-static-server")
const router = require("./routes/forecast")
const authorize = require("./lib/authorize")
const cache = require("./lib/cache")
const Koa = require("koa")

const app = new Koa()

// set http server host/port
const http_host = process.env.HTTP_HOST || "localhost"
const http_port = process.env.HTTP_PORT || 3000

// server options
const options =
{
    // fallback to HTTP1 when HTTP2 is not supported
    allowHTTP1: true,

    // HTTPS certificates (self signed)
    key: fs.readFileSync("./cert/server.key"),
    cert: fs.readFileSync("./cert/server.crt")
}

// simple access logging
app.use(async (ctx, next) =>
{
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// check authorization key if provided
app.use(authorize)

// set HTTP ETag to avoid sending same data to clients
app.use(conditional())
app.use(etag())

// serve images
app.use(serve({rootDir: "public/icons", rootPath: "/icon", maxage: 86400000 }))

// spport HTTP compression of the response when requested
// ignore if response is smaller than 256 bytes
app.use(compress({ threshold: 256 }))

// HTTP and in memory response caching
app.use(cache())

// our routes
app.use(router.routes())
app.use(router.allowedMethods())

// start https or http2 server
const server = (process.env.USE_HTTP2 === "true")
    ? require("http2").createSecureServer(options, app.callback())
    : require("https").createServer(options, app.callback())

server.listen(http_port, http_host, () =>
{
    console.log(`listening on ${http_host}:${http_port}`)
})

module.exports = server
