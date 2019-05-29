//Load app server using Express
const express = require('express')
const app = express()

//Setting up templaing view engine - EJS
app.set('view engine', 'ejs')
app.use(express.static("views"))

//Index
app.get("/", (req, res) => {
    res.render('index')
})

//Localhost:3003
app.listen(3000, () => {
    console.log('Server running at port 3000: http://127.0.0.1:3000')
})