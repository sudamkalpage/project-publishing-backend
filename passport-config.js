const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user');
var user //global variable for user

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {

    // const user = getUserByEmail(email)
    user = await User.findOne({email: email });
    // console.log(user)
    
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log('Password is correct...')
        
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.email))
  passport.deserializeUser((email, done) => {return done(null, user)})
//   passport.serializeUser((user, done) => done(null, user._id))
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id))
//   })
}

module.exports = initialize