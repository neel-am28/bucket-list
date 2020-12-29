const express = require('express')
const app = express()
const router = require('./router')
const flash = require('connect-flash')
const session = require('express-session')

let sessionOptions = session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('public'))
app.use(sessionOptions)
app.use(flash())
app.set("views", "views")
app.set("view engine", "ejs")

app.use(function (req, res, next) {
    res.locals.message = req.flash()
    next()
})

app.use('/', router)

module.exports = app