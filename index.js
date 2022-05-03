require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const authRoutes = require('./routes/auth')

const app = express()

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('**DB CONNECTED**'))
    .catch((err) => console.log('DB CONNECTION ERROR => ', err))

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/auth', authRoutes)

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
