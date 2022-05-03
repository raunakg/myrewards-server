const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { hashPassword, comparePassword } = require('../utils/helper')

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name) return res.status(400).send('Name is required')
        if (!password || password.length < 6) {
            return res
                .status(400)
                .send(
                    'Password is required and should be min 6 characters long'
                )
        }
        let userExist = await User.findOne({ email }).exec()
        if (userExist) return res.status(400).send('Email already registered')

        // hash password
        const hashedpassword = await hashPassword(password)

        // register
        const user = new User({
            name,
            email,
            password: hashedpassword,
        })
        await user.save()

        // console.log("saved user", user);

        return res.json({ ok: true })
    } catch (err) {
        console.log(err)
        return res.status(400).send('Error, Try again')
    }
}

const login = async (req, res) => {
    try {
        //console.log(req.body)

        const { email, password } = req.body
        const user = await User.findOne({ email }).exec()
        if (!user) return res.status(400).send('No user found')
        //check password
        const match = await comparePassword(password, user.password)
        if (!match) return res.status(400).send('Wrong Password!')
        // create signed jwt

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '3d',
        })
        // return user and token to client, exclude hashed password
        user.password = undefined
        res.cookie('token', token, {
            httpOnly: true,
            // secure: true, //only works on https
        })
        // send user as json response
        res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(400).send('Error, Try again')
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie('token')
        return res.json({ message: 'Signout Success' })
    } catch (err) {
        console.log(err)
    }
}

const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .exec()
        // console.log('CURRENT_USER', user)
        return res.json({ ok: true })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    register,
    login,
    logout,
    currentUser,
}
