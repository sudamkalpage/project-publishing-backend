/*jshint esversion: 8 */
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')
const jwt = require('jsonwebtoken')
const User = require('./models/user');

// const users = []
let SESSION_SECRET = '2095ac68f54991da41b2b776fbc93b55bb5b1f136e6fa428fccbafe9aa212890e54da130eda9d9a18b93055aa6ba30eb3a0456f967f56bdf3b1b74250b6513d3'
let ACCESS_TOKEN_SECRET = '36386131b427d63b12369f8a4f10be7a35c62113efd8f2dd80aa53667e4d8e8a6f18bbb5bf82a256c7466f25dde22deab1a77047b7a8a69c074c0b261d89aac4'

//connect to database
const url = 'mongodb://localhost/project_publishing_db';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const con = mongoose.connection;
con.on('open', () => {
    console.log("connected .. ");
});

const app = express();
app.use(express.json());
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

//define middlewares
const usersRoute = require('./routes/users')
app.use('/users',usersRoute)

app.post('/register', checkNotAuthenticated, async (req, res) => {   
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10) 
        const new_user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        await new_user.save()   
            .then( docs => {
                console.log(docs);
                res.status(200).json(docs);
            }).catch(err => {
                console.log(err); 
                res.status(500).json({error: err});
            }); 
    }    catch {
            res.status(400).json("Registration was Failed!");  
    }
  })

app.get('/failedlogin', async(req,res)=>{
    res.status(401).json("Login attempt was failed. Check credentials again!");    
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
failureRedirect: '/failedlogin',
failureFlash: true
}),
(req, res, next) => {
    console.log("success login")
    const email = req.body.email  
    const user = { email: email }
  
    const accessToken = jwt.sign(user, SESSION_SECRET)
    res.json({ accessToken: accessToken})
  }
)

app.delete('/logout',checkAuthenticated, (req, res) => {
req.logOut()
res.status(200).json("Logout was successfull!");   
})


//Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

initializePassport(
    passport,
    async (email) => await User.findOne({email: email }),
    id =>  User.findOne({_id: id })
  )
  
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

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

module.exports = app