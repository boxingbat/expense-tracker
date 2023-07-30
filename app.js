const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const Handlebars = require('handlebars')
const PORT = process.env.PORT || 3000
const app = express()
const routes = require('./routes')
const session = require('express-session')
const usePassport = require('./config/passport')
const passport = require('./config/passport')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

require('./config/mongoose')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(methodOverride('_method'))

app.use(session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))
usePassport(app)

app.use(routes)

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`)
})