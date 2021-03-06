# weather-service
Node.js weather service.

  * [Running](#running)
  * [Configuration](#configuration)
  * [API](#api)
  * [Caching, Compression, HTTP/2](#caching-compression-http2)
  * [Providers](#providers)
  * [Scalability](#scalability)
  * [Testing](#testing)

## Running

```
npm install
PROVIDER_API_KEY=xxxx npm start
```

By default this starts HTTP/2 server on the localhost, port 3000.
```
listening on localhost:3000
```

***Note*** for each provider a valid api key is needed if the service requires it. See
http://openweathermap.org/appid for **openweather** provider.

## Configuration

Configuration values can be changed by setting enviroment variables.

* **HTTP_HOST** - provide alternative host for the HTTP server
* **HTTP_PORT** - provide alternative port for the HTTP server
* **ACCESS_KEY** - when set, clients need to provide this accessKey to authorize requests
* **PROVIDER_NAME** - set weather service provider, currently only **openweather** is supported
which is also a default value
* **PROVIDER_API_KEY** - set a valid weather service provider api key

Example usage:
```
HTTP_PORT=3001 ACCESS_KEY=1234 PROVIDER_API_KEY=xxxx npm start
```

## API

* Get forecast by the **city** name

    * **Request** - https://localhost:3000/forecast?city={cityName,[country_code]}

        The openweather provider supports additional ISO 3166 country code for better acurracy.

        *https://localhost:3000/forecast?city=Berlin,de*

    * **Response**

        The response contains weather data for the next 24 hours in block of 3 hours.

        ```
        {
            "sunrise": "2017-12-10T07:06:59",
            "sunset": "2017-12-10T14:52:08",
            "time": [
            {
                "from": "2017-12-10T18:00:00",
                "to": "2017-12-10T21:00:00",
                "name": "light snow",
                "icon": "13n",
                "temperature": -0.41,
                "humidity": 93,
                "precipitation": {
                    "value": 1.402,
                    "type": "snow"
                },
                "wind": {
                    "speed": 6.16,
                    "desc": "Moderate breeze",
                    "deg": 147.001,
                    "dir": "SSE"
                }
            },
            ...
        }
        ```

        * **sunrise** - sun rise time in the ISO UTC format
        * **sunset** - sun set time in the ISO UTC format
        * **time** - array of weather data in the block of 3 hours
            * *from* - start of the time block range in the ISO UTC format
            * *to* - end of the time block range in the ISO UTC format
            * *name* - textual representation of the weather, i.e. *clear sky*
            * *icon* - uid of the weather icon
            * *temperature* - temperature, `celsius`
            * *humidity* - humidity value, `percent`
            * *precipitation* - if provided contains:
                * value - precipitation value, `milimitters(mm)`
                * type - one of [snow, rain, no]
            * *wind*
                * *speed* - speed of the wind, `meters per second(mps)`
                * *desc* - textual representation of the wind, i.e. *Moderate breeze*
                * *deg* - wind direction, `degrees`
                * *dir* - direction of the wind by the initials [N, E, S, W, NE, SE, SW, ...]

* Get forecast by **latitude** and **longitude**

    * **Request** - https://localhost:3000/forecast?lat={latitue}&lon={longitude}

        ```https://localhost:3000/forecast?lat=52.520008&lon=13.404954```

    * **Response**

        Same as above.

* Get weather **icon** by the uid (this is provided by the api)

    * **Request** - https://localhost:3000/icon/{icon.png}

        ```https://localhost:3000/icon/11n.png```

    * **Response**

        Raw image.

 * Access key - when access key is setup on the server clients also need to provide it as part of
 the request

    ```https://localhost:3000/forecast?city=Berlin&accessKey=1234```

## Caching, Compression, HTTP/2

Service employs multiple techniques to minimize the latency and data returned to the client.
* HTTP/2 - enabled by default but also supports HTTP/1 through ALPN.
 * HTTP compression - supports standard HTTP gzip, deflate compression to minimize data size.
 * HTTP and in memory caching - caches requests for a specified amount of time to avoid processing
 data at each request returning Cache-Control headers to the client.

## Providers

 At the moment only **openweather** is provided. This can be easily extended to support other
 providers. See [providers](providers) for more info.

## Scalability

 Vertical and horizontal scaling is supported. `pm2` can be used to easily scale the app, i.e.:

 ```
 npm install pm2@latest -g
 pm2 start index.js -i 4
 ```

## Testing

 To check if all tests are valid and passed run:

 ```
 npm run test


 listening on localhost:3000
  API
GET /forecast?city=Berlin - 320ms
    ✓ should get forecast by city (374ms)
GET /forecast?lat=52.520008&lon=13.404954 - 226ms
    ✓ should get forecast by latitude, longitude (247ms)
GET /forecast?lat=52.520008 - 0ms
    ✓ should throw error on missing longitude
GET /forecast?lon=13.404954 - 0ms
    ✓ should throw error on missing latitude
GET /forecast - 0ms
    ✓ should throw error on invalid parameters


  5 passing (660ms)
 ```

 This starts the service and checks data from the providers so valid api key is also needed.
