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
const { redirectLogin } = require('./middleware/auth');
const { hashPassword } = require('./middleware/inputVal');

const defaultUsers = [['gold', 'smiths'], ['firstFriend', 'password']];

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and static js) UPDATE THIS
app.use(express.static(path.join(__dirname, 'public')))

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
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

// Function to hash default user passwords after first setup
const hashDefaultPasswords = () => {
    defaultUsers.forEach(user => {
        const [username, plainPassword] = user;

        // 1. Check if the user exists with the plain password
        const selectQuery = 'SELECT id, password FROM users WHERE username = ? AND password = ?';
        db.query(selectQuery, [username, plainPassword], async (err, results) => {
            if (err) {
                console.error('Error querying user:', err);
                return;
            }

            if (results.length > 0) {
                const userId = results[0].id;

                try {
                    // 2. Hash the password using your existing hashPassword function
                    const hashedPassword = await hashPassword(plainPassword);

                    // 3. Update the user's password in the database
                    const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
                    db.query(updateQuery, [hashedPassword, userId], (err, updateResult) => {
                        if (err) {
                            console.error('Error updating password:', err);
                        } else {
                            console.log(`Password hashed for user ${username}`);
                        }
                    });
                } catch (hashErr) {
                    console.error('Error hashing password:', hashErr);
                }
            } else {
                console.log(`No matching user found for ${username}`);
            }
        });
    });
};

hashDefaultPasswords();

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/usr/365/', mainRoutes);

// Load the route handlers for /users
const usersRoutes = require('./routes/users');
app.use('/usr/365/users', usersRoutes);

// Load the route handlers for /workouts
const workoutRoutes = require('./routes/workouts');
app.use('/usr/365/workouts', workoutRoutes);

// Load the route handlers for /friends
const friendsRoutes = require('./routes/friends');
app.use('/usr/365/friends', friendsRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`));