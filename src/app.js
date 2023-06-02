const express = require('express');
const serverless = require("serverless-http");
const mysql = require("mysql2")
const path = require("path")
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

dotenv.config({ path: './.env'})

const app = express(),
    bodyParser = require("body-parser");
    port = 3100;

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_ROOT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    ssl: { rejectUnauthorized: true },


})

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.use(bodyParser.json());

app.post('/api/sign_in', (req, res) => {
  console.log('api/sign_in called!!!!')
  const email = req.body.email;
  const pass = req.body.pass;

  return db.query('SELECT name,password_hash FROM users WHERE email = ?', [email], async (error, result) => {
    if(error) {
        console.log(error)
    }
    return res.json(result);
  });
});


app.post('/api/user', (req, res) => {
  const id = req.body.id;
  const user = req.body.username;
  const pass = req.body.pass;
  const email = req.body.email;
  const name = req.body.name;
  console.log('Adding user::::::::', user);
  return db.query('INSERT INTO users SET?', {id:id, email:email, username:user, password_hash:pass, name:name},
         (error, result) => {
            if(error) {
                console.log(error)
            }
            return res.json("User registered");
        });
});

app.get('/', (req,res) => {
    res.send('App Works !!!!');
});

app.listen(process.env.PORT || 3100, () => {
    console.log(`Server listening on the port::${port}`);
});

const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.set('view engine', 'hbs')

// app.get('/', (req,res) => {
//     res.sendFile(path.join(__dirname, '../my-app/out/index.html'));
//   })
//   app.use(`/.netlify/functions/api`, router);

// module.exports = app;
// module.exports.handler = serverless(app);

// const express = require("express");
// const serverless = require("serverless-http");

// // Create an instance of the Express app
// const app = express();

// // Create a router to handle routes
// const router = express.Router();

// // Define a route that responds with a JSON object when a GET request is made to the root path
// router.get("/", (req, res) => {
//   res.json({
//     hello: "hi!"
//   });
// });

// // Use the router to handle requests to the `/.netlify/functions/api` path
// app.use(`/.netlify/functions/api`, router);

// // Export the app and the serverless function
// module.exports = app;
// module.exports.handler = serverless(app);
