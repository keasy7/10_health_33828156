var express = require ('express')
var ejs = require('ejs')
const path = require('path')
var mysql = require('mysql2')
require('dotenv').config()
var session = require('express-session')
// Create the express application object
const app = express()
const port = 8000
const expressSanitizer = require('express-sanitizer');

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and static js) UPDATE THIS
//app.use(express.static(path.join(__dirname, 'public')))

// Set up express-sanitizer
app.use(expressSanitizer());

// Set up the session middleware cookies
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))


// Define our application-specific data
//app.locals.shopData = {shopName: "Bertie's Books"}

// Define the database connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;