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
const User = require('./models/user');

// const users = []
let SESSION_SECRET = '2095ac68f54991da41b2b776fbc93b55bb5b1f136e6fa428fccbafe9aa212890e54da130eda9d9a18b93055aa6ba30eb3a0456f967f56bdf3b1b74250b6513d3'

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
    // try {
    //   const hashedPassword = await bcrypt.hash(req.body.password, 10)
    //   users.push({
    //     id: Date.now().toString(),
    //     name: req.body.username,
    //     email: req.body.email,
    //     password: hashedPassword
    //   })
    // console.log(users)
    // res.sendStatus(200)

    // } catch {
    //   res.redirect('/register')
    // }
    
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
          res.redirect('/register')
    }
    

    
  })

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
successRedirect: '/users/find/all',
failureRedirect: '/login',
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

app.delete('/logout', (req, res) => {
req.logOut()
res.redirect('/login')
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
    // email => users.find(user => user.email === email),
    // id => users.find(user => user._id === id)
    async (email) => await User.findOne({email: email }),
    id =>  User.findOne({_id: id })
  )
  
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/logins')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {        
      return res.redirect('/')
    }
    console.log('Not Authenticated..')
    next()
  }

module.exports = app