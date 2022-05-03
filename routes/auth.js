const express = require('express')
const { register, login, logout, currentUser } = require('../controllers/auth')

const { requireSignin } = require('../middlewares')

const router = express.Router()

router.post('/register', register)

router.post('/login', login)

router.get('/logout', logout)

router.get('/current-user', requireSignin, currentUser)

module.exports = router
