# Providers

Providers can be easily added by extending default interfaces.

Implement and export `getForecast` function that receives `city, lat, lon` parameters and returns
JSON object representing data as described in **API** section.

```
module.exports =
{
    // city or lat&lon will be provided
    getForecast: async function(city, lat, lon)
    {
        // process and return data from the api
        // return { ... }
    }
}
```

Add any weather icons that api provides to the `public/icon` directory. This way we can avoid
fetching images from the upstream servers to minimize latency.
(In production setup it is better to move this to a CDN or a proxy server like Nginx)
