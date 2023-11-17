const axios = require('axios');
const fs = require('fs');
const yargs = require('yargs');



function loadConfig() {
    try {
        const readConfigData = fs.readFileSync('config.json')
        return JSON.parse(readConfigData)
    } catch (error) {
        console.error('Ошибка при загрузке конфигурации:', error.message);
    }

}

function writeConfigData(config) {
    try {
        fs.writeFileSync('config.json', JSON.stringify(config))
        console.log('Конфигурация сохранена.');
    } catch (error) {
        console.error('Ошибка при сохранении конфигурации:', error.message);
    }

}

async function getWeather(city, token) {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}`)
        return res.data
    } catch (error) {
        console.error('Ошибка при формировании прогноза погоды:', error.message);
    }

}

const argv = yargs
    .option('s', {
        alias: 'city',
        describe: 'City to get weather',
        type: 'string'
    })
    .option('t', {
        alias: 'token',
        describe: 'Token for API',
        type: 'string'
    })
    .option('-h', {
        alias: 'help',
        describe: 'Reference'
    })
    .argv

console.log(argv);

const config = loadConfig()


const city = argv.city || (config ? config.city : 'Nizhny Novgorod')
const token = argv.token || (config ? config.token : null)
console.log('CITY:',city);
console.log('TOKEN:',token);

if (token) {
    getWeather(city, token).then((weatherData) => {
        if (weatherData) {
            console.log(`Weather in: ${city}`);
            console.log(`${weatherData.weather[0].description}`);
            console.log(`Temperature: ${Math.floor(weatherData.main.temp - 273)}° C`);
            console.log(`Feels like: ${Math.floor(weatherData.main.feels_like - 273)}° C`);
            console.log(`Wind speed: ${weatherData.wind.speed} m/s`);

        }
    })
} else {
    console.error('Токен для API не указан или указан не верно.');
}

if (argv.city || argv.token) {
    const writeNewConfig = { city, token }
    writeConfigData(writeNewConfig)
}

