const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('postman-request')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and view location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ernest' 
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About',
        name: 'Ernest'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'Ernest',
        message: 'How can I help you?'
    })
})

app.get('/weather', (req,res) => {
    
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, {lat,long,location} = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(lat,long,(error,{weather,weatherDescription,currentTemperature} = {}) => {
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                location,
                description: weatherDescription,
                temperature: currentTemperature,
                forecast: weather,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found.',
        name : 'Ernest'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found.',
        name: 'Ernest'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})