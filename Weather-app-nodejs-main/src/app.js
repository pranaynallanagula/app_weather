const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 5000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//SetUp handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather Updates',
        name: 'Sai Pranav Koyyada'
    })
})

app.get('/about',(req, res) => {
    res.render('about',{
        title: 'About Us!',
        name: 'Sai Pranav Koyyada'
    })
})

app.get('/help',(req, res) => {
    res.render('help', {
        helpText: 'Enter the name of the city/county/region/country in the location form of the weather page to know current weather conditions in that area.',
        title: 'Help',
        name: 'Sai Pranav Koyyada'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'No address, Please Provide!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, location,(error, forecastData) => {
            console.log(latitude, longitude)
            if (error) {
                return res.send({ error })
            }

            res.send ({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term!'
        })
    }

    console.log(req.query.search)
    res.send ({
        products: []
    })
})

app.get('/help/*',(req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alice',
        errorMessage: 'Help Article Not Found!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alice',
        errorMessage: 'Page Not Found!'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})