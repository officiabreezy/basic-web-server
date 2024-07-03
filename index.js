const express = require('express');
const axios = require('axios');
const requestIp = require('request-ip');
const dotenv = require('dotenv').config();
const app = express();

const port = process.env.PORT || 3000;


app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'isaac';
    const clientIp = req.clientIp || '127.0.0.0';

    try{
        const locationResponse = await axios.get(`http://ipinfo.io/${clientIp}/json`);
        const locationData = locationResponse.data;
        const city = locationData.city || 'abeokuta city';

        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=${city}`);
        const weatherData = weatherResponse.data;
        const temperature = weatherData.current.temp_c;

        res.json({
            client_ip: clientIp,
            location: city,
            greeting: `hello, ${visitorName}!, the temperature is ${temperature} degree celsius in ${city}`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port,() => {
    console.log(`listening on port ${port}`);
});