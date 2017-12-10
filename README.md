# weather-service
Node.js weather service.

## Running

Node 9.x should be used in case of HTTP/2 support.

```
npm install
npm start
```

By default this starts https server on the localhost, port 3000.
```
listening on localhost:3000
```

## Configuration

Configuration values can be changed by setting enviroment variables.

* **HTTP_HOST** - provide alternative host for the HTTP server
* **HTTP_PORT** - provide alternative port for the HTTP server
* **USE_HTTP2=true** - use HTTP/2 server (with HTTP/1.1 fallback) instead of HTTP/1.1
* **PROVIDER** - set weather service provider, currently only **openweather** is support which is also
default

Example usage:
```
HTTP_PORT=3001 USE_HTTP2=true npm start
```

## API

### Request
* Get forecast by the **city** name

    ```https://localhost:3000/forecast?city=Berlin```

 The openweather provider supports additional ISO 3166 country code for better acurracy.

 `https://localhost:3000/forecast?city=Berlin,de`

* Get forecast by **latitude** and **longitude**

    ```https://localhost:3000/forecast?lat=52.520008&lon=13.404954```

* Get weather **icon** by the uid (this is provided by the api)

    ```https://localhost:3000/icon/11n.png```

### Response

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

## Caching, Compression, HTTP/2

Service employs multiple techniques to minimize the latency and data returned to the client.
* HTTP/2 - supports HTTP/2 by using `USE_HTTP2=true` env settings which reduces data size. ***Note*** it is not enabled by default since Node module is still in experimental state.
 * HTTP compression - supports standard HTTP gzip, deflate compression to minimize data size.
 * HTTP caching - caches requests for a specified amount of time to avoid processing data at each request.

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

 To check if all test are valid and passed run:

 ```
 npm run test
 ```
