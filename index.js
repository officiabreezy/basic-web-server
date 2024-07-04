const express = require('express');
const axios = require('axios');
const requestIp = require('request-ip');
const dotenv = require('dotenv').config();
const app = express();

app.use(requestIp.mw());

const port = process.env.PORT || 3000;


app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'isaac';
    const clientIp = req.ip || '127.0.0.0';


    try{
        const locationResponse = await axios.get(`http://ipinfo.io/102.88.35.182/json?token=fb8dbb73e54520`);
        const locationData = locationResponse.data;
        const loc = locationResponse.data.loc
        const [latitude,longitude] = loc.split(',');
        const city = locationData.city || 'Ibadan city'
        // const lat = locationResponse.data.lat
        console.log(locationData);
        console.log(loc);
    

        //const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=${city}`);
        const { data: weatherData } = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=${loc}`)
        console.log(weatherData);
        //const weatherData = weatherResponse.data;
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