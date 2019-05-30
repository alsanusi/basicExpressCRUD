//Load app server using Express
const express = require('express')
const app = express()
const mysql = require('promise-mysql')
// Load DB Config
const dbConfig = require('../config')

// Routing Process
// Show the Default Web Page and View all the EmployeeData
app.get('/', (req, res) => {
    req.getConnection(function (err, con) {
        con.query('SELECT * FROM employeeData ORDER BY id DESC', function (err, rows, fields) {
            if (err) {
                req.flash('error', err)
                res.render('index', {
                    data: ''
                })
            } else {
                res.render('index', {
                    data: rows
                })
            }
        })
    })
})

// Input Employee Data
app.route('/input')
    .get((req, res) => {
        res.render('input', {
            name: '',
            email: '',
            address: '',
            phone: ''
        })
    })
    .post((req, res) => {
        // Input Form Validation
        req.assert('name', 'Required Name!').notEmpty()
        req.assert('email', 'Require Email!').notEmpty()
        req.assert('address', 'Require Address!').notEmpty()
        req.assert('phone', 'Required Phone Number!').notEmpty()

        var errors = req.validationErrors()

        if (!errors) {
            var employeeData = {
                name: req.sanitize('name').escape().trim(),
                email: req.sanitize('email').escape().trim(),
                address: req.sanitize('address').escape().trim(),
                phone: req.sanitize('phone').escape().trim()
            }
            req.getConnection(function (err, con) {
                con.query('INSERT INTO employeeData SET ?', employeeData, function (err, result) {
                    // If Throw Error
                    if (err) {
                        req.flash('error', err)
                        res.render('input', {
                            name: employeeData.name,
                            email: employeeData.email,
                            address: employeeData.address,
                            phone: employeeData.phone
                        })
                        // res.redirect('/')
                    } else {
                        req.flash('success', 'Employee Data Input Successfully!')
                        res.render('input', {
                            name: '',
                            email: '',
                            address: '',
                            phone: ''
                        })
                        // res.redirect('/')
                    }
                })
            })
        } else {
            // When error occurs, the message will show.
            var error_msg = ''
            errors.forEach(function (error) {
                error_msg += error.msg + '</br>'
            })
            req.flash('error', error_msg)
            res.render('input', {
                name: req.body.name,
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone
            })
        }
    })

module.exports = app;