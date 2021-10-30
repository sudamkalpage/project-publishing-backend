const express = require('express')
const jwt = require('jsonwebtoken')
const Token = require('./models/token');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
const User = require('./models/user');

let ACCESS_TOKEN_SECRET = '36386131b427d63b12369f8a4f10be7a35c62113efd8f2dd80aa53667e4d8e8a6f18bbb5bf82a256c7466f25dde22deab1a77047b7a8a69c074c0b261d89aac4'
let REFRESH_TOKEN_SECRET = 'd1326e6fb8c73bbfbaefcf58730473a40aa822c4aa437ad8a6e99b44e345850456dca2bc3f087e7db4c66ca933651b19a26e317dd316a86bfc82df95265a280f'
let SESSION_SECRET = '2095ac68f54991da41b2b776fbc93b55bb5b1f136e6fa428fccbafe9aa212890e54da130eda9d9a18b93055aa6ba30eb3a0456f967f56bdf3b1b74250b6513d3'
let port = 9001;

//connect to database
const url = 'mongodb://localhost/project_publishing_db';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const con = mongoose.connection;
con.on('open', () => {
    console.log("connected .. ");
});

const app = express()
app.use(express.json())
app.use(morgan('dev'));
app.use('static', express.static('static'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.post('/login', checkNotAuthenticated, passport.authenticate('local', { // Authenticate User
    failureRedirect: '/failedlogin',
    failureFlash: true
    }),
    async (req, res) => {
    const username = req.body.username
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET)

    const new_token = new Token({
        refresh_token: refreshToken
    })

    console.log("im here")

    await new_token.save()
    .then( docs => {
        console.log(docs);
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
    }).catch(err => {
        console.log(err); 
        res.status(500).json({error: err});
    }); 
})

app.post('/token', async (req, res) => {
  console.log("refreshing tokens..")
  const refreshToken = req.body.token
  if (refreshToken == null) return res.status(401).json("No refresh token has been sent!");  
  refresh_token_document = await Token.findOne({refresh_token: refreshToken });
  if (refresh_token_document == null) return res.status(403).json("Refresh token is not valid!"); 
  refresh_token = refresh_token_document.refresh_token
  console.log(refresh_token)
  jwt.verify(refresh_token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', checkAuthenticated,  async (req, res) => {
    console.log("Deleting a refresh token..")
    await Token.deleteOne({refresh_token: req.body.token})
        .exec()
        .then(() => {
            res.status(200).json("successfully refresh token removed");
        })
        .catch(err => {
            res.status(500).json({error: err})
        });
})


function generateAccessToken(user) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
}

initializePassport(
    passport,
    async (email) => await User.findOne({email: email }),
    id =>  User.findOne({_id: id })
  )

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    console.log('Not Authenticated..')   
    return res.status(409).json("You are not authenticated");  
  }
  
function checkNotAuthenticated(req, res, next){
if (req.isAuthenticated()) {  
    console.log('Already Authenticated..')   
    return res.status(409).json("You are already authenticated");  
}
console.log('Not already Authenticated..')
next()
}

//start server in port 9001
app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});