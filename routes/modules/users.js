const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login'
    })(req, res)
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const user = await User.findOne({ email })
        if (user) {
            console.log('User already exists.')
            return res.render('register', {
                name,
                email,
                password,
                confirmPassword
            })
        }
        await User.create({
            name,
            email,
            password
        })
        return res.redirect('/')
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
})

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) { return next(err) }
        res.redirect('/users/login')
    })
})

module.exports = router