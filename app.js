const express = require('express');
const mysql = require("mysql2")
const path = require("path")
const dotenv = require('dotenv')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

dotenv.config();

const app = express(),
    bodyParser = require("body-parser");
    port = 3080;

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

// just for testing purposes
const users = ['Anant'];

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

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

const publicDir = path.join(__dirname, './public')
app.use(express.static(publicDir))
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.set('view engine', 'hbs')

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../my-app/out/index.html'));
  })


// app.post("/auth/register", (req, res) => {    
//     const { name, email, password, password_confirm } = req.body

//     db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
//         if(error){
//             console.log(error)
//         }

//         if( result.length > 0 ) {
//             return res.render('register', {
//                 message: 'This email is already in use'
//             })
//         } else if(password !== password_confirm) {
//             return res.render('register', {
//                 message: 'Password Didn\'t Match!'
//             })
//         }

//         let hashedPassword = await bcrypt.hash(password, 8)

//         console.log(hashedPassword)
       
//         db.query('INSERT INTO users SET?', {name: name, email: email, password: hashedPassword}, (err, result) => {
//             if(error) {
//                 console.log(error)
//             } else {
//                 return res.render('register', {
//                     message: 'User registered!'
//                 })
//             }
//         })        
//     })
// })

// app.listen(5000, ()=> {
//     console.log("server started on port 5000")
// })