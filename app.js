//Load app server using Express
const express = require('express')
const app = express()

// Load Env
require('dotenv').config()

//Load MySQL Configuration
const mysql = require('mysql')
const myConnection = require('express-myconnection')

//Load DB Configuration
const dbOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
}

/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */
app.use(myConnection(mysql, dbOptions, 'pool'))

//Setting up templaing view engine - EJS
app.set('view engine', 'ejs')
app.use(express.static("views"))

// Express Validator Middleware for Form Validation
const expressValidator = require('express-validator')
app.use(expressValidator())

// body-parser is used to read HTTP POST data from Form Input.
var bodyParser = require('body-parser')
// bodyParser.urlencoded() parses the text as URL encoded data.
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// Flash messages in order to show success or error message.
const flash = require('express-flash')
app.use(flash())

// Flash require Session
// Express-Session
const session = require('express-session');
app.use(session({
    cookie: {
        maxAge: 6000
    },
    secret: 'weuw',
    resave: false,
    saveUninitialized: false
}))

// Method-Override
var methodOverride = require('method-override')
// Custom logic for overriding method
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

// Show the Employee Route
const employeeRoute = require('./routes/employee')
app.get('/', employeeRoute.showData)
app.get('/input', employeeRoute.showInputData)
app.post('/input', employeeRoute.inputData)
app.get('/edit/(:id)', employeeRoute.showEditData)
app.put('/edit/(:id)', employeeRoute.editData)
app.delete('/delete/(:id)', employeeRoute.deleteData)

//Handle Express Error
app.use((err, req, res, next) => {
 res.status(500).json({
   status: false,
   name: err.name,
   message: err.message
 })
})

//Localhost:3003
app.listen(3003, () => {
    console.log('Server running at port 3000: http://127.0.0.1:3003')
})
