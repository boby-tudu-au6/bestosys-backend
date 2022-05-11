require("dotenv").config();
const express = require('express')
const cors = require("cors")
const app = express()
const post = require('./routes/post/route_post')
const get = require("./routes/get/route_get")
const paymentApi = require('./routes/post/payment')
const AppError = require('./utils/apperror')
const globalerrorHandler = require('./middleware/errorController')
require('./db')
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(post)
app.use(get)
app.use('/payment', paymentApi)
// middleware for handling error regarding if particular route is not present 
app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl}on this server`, 404))
})
app.use(globalerrorHandler)
const port = process.env.PORT || 8080
app.listen(port, (err) => {
    if (err) {
        return res.json(err).status(400)
    }
    console.log("server running")
})