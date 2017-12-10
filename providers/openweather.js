const fastXmlParser = require("fast-xml-parser")
const util = require("util")
const request = require("../lib/request")

// default api url
// xml is used since it somehow contains different data than json format
// api_key is appid from openweather.org that has to be obtained
const api_key = ""

console.assert(api_key, "please provide valid appid from http://openweathermap.org/appid")

const api_url = "https://weather.qaap.io/data/2.5/forecast" +
                "?cnt=8" +
                "&mode=xml" +
                "&units=metric" +
                "&appid=" + api_key

const xml_parse_options =
{
    attrPrefix: "_",
    attrNodeName: false,
    ignoreNonTextNodeAttr: false,
    ignoreTextNodeAttr: false,
    ignoreNameSpace: true,
    ignoreRootElement: true,
    textNodeConversion: true,
    textAttrConversion: true
}

module.exports =
{
    getForecast: async function(city, lat, lon)
    {
        // get data from the api by city name, i.e. "Berlin"
        if (typeof city === "string")
        {
            const xml = await request(api_url + "&q=" + city)
            const json = fastXmlParser.parse(xml, xml_parse_options)
            return parse_response(json.weatherdata)
        }
        // get data from the api by lat, lon parameters
        else if (!Number.isNaN(lat) && !Number.isNaN(lon))
        {
            const lon_lat_string = util.format("&lat=%d&lon=%d", lat, lon)
            const xml = await request(api_url + lon_lat_string)
            const json = fastXmlParser.parse(xml, xml_parse_options)
            return parse_response(json.weatherdata)
        }
    }
}

/**
 * parse and get only fields we need
 * @param {object} input data from the xml
 * @returns {object} data with the fields that we want
 */
function parse_response(input)
{
    const output =
    {
        sunrise: input.sun._rise,
        sunset: input.sun._set,
        time: []
    }

    for (const time of input.forecast.time)
    {
        output.time.push({
            from: time._from,
            to: time._to,
            name: time.symbol._name,
            icon: time.symbol._var,
            temperature: time.temperature._value,
            humidity: time.humidity._value,
            precipitation:
            {
                value: time.precipitation._value,
                type: time.precipitation._type,
            },
            wind:
            {
                speed: time.windSpeed._mps,
                desc: time.windSpeed._name,
                deg: time.windDirection._deg,
                dir: time.windDirection._code
            }
        })
    }

    return output
}
