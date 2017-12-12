/*
 * simplified promise based native request module
 *
 */

const { get } = require("https")
module.exports = function(url)
{
    return new Promise((resolve, reject) =>
    {
        get(url, (response) =>
        {
            let body = ""
            response.on("data", (chunk) => body += chunk)
            response.on("end", () => resolve(body))
        }).on("error", (error) => reject(error))
    })
}
