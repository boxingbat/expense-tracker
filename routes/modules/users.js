const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {

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

module.exports = router