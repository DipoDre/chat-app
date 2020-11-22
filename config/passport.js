const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, cb) => {
  User.findOne({username: username}, (err, user) => {
    if(err) { return cb(err);}
    if(!user) { return cb(null, false, {message: 'Username not found'}); }
    bcrypt.compare(password, user.password, (err, res) => {
      if(!res) return cb(null, false, { message: 'Invalid Password' });
let userDetails = {
        email: user.email,
        username: user.username,
        id: user.id
      };
return cb(null, userDetails, { message: 'Login Succesful'});
    });
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne(id, (err, user) => {
    done(err, user);
  });
});


