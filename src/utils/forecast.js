const request = require('postman-request')
const dotenv = require('dotenv')

dotenv.config()

const forecast = (lat,long,callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=' + process.env.FORECAST_KEY + '&query=' + lat + ',' + long + '&units=f'
    
    request({ url , json: true}, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location!')
        } else {
            callback(undefined, {
                weather : body.current.weather_descriptions[0]+ '. It is currently ' + body.current.temperature + ' degrees out. It feels like ' + body.current.feelslike + ' degrees out there.',
                weatherDescription: body.current.weather_descriptions[0],
                currentTemperature: body.current.temperature,
                feelsLike: body.current.feelslike
            })
        }
    })
}


module.exports = forecast