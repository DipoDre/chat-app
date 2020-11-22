/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require('nodemailer');
const passport = require('passport');

module.exports = {

  login: function(req, res) {
    passport.authenticate('local', (err, user, info) => {
      if((err) || (!user)) {
        /* return res.send({
          message: info.message,
          user
        }); */
        res.redirect('/auth/register');
      }

      req.logIn(user, async (err) => {
        if(err) { res.send(err); }
        /* return res.send({
          message: info.message,
          user
        }); */
        req.session.username = user.username;

        let loggedinUser = await User.updateOne({ username:req.session.username })
        .set({ online: true });

        if (loggedinUser) {
          sails.log('Is logging in.');

          // Blast the message to all connected sockets.
          sails.sockets.blast('user', {
            verb: 'updated',
            id: loggedinUser.id,
            data: {
              email: loggedinUser.email
            }
          });

        } else{
          sails.log('Online status did not change after logging in.');
        }

        // console.log(user);
        res.redirect('/chat');
      });
    })(req, res);
  },

  logout: async function(req, res) {
    let showme = 'I am logging out';
    console.log(showme);

    let currentUser = await User.updateOne({ username:req.session.username })
    .set({ online: false });

    if (currentUser) {
      sails.log('Is logging out.');
      // Blast the message to all connected sockets.
      sails.sockets.blast('user', {
        verb: 'updated',
        id: currentUser.id,
        data: {
          email: currentUser.email
        }
      });

    } else{
      sails.log('Online status did not change after logging out.');
    }

    req.logout();
    res.redirect('/');
  },


  adduser: async (req, res) => {
    const { name, username, email, password, password2 } = req.body;
    let errors = [];

    console.log(req.body);

    console.log(name + ' ' + username + ' ' + email + ' ' + password + ' ' + password2);

    if(!name || !email || !username || !password || !password2){
      errors.push({msg: 'Please fill in all fields'});
    }

    if(password !== password2){
      errors.push({msg: 'Passwords do not match'});
    }

    if(password.length < 8){
      errors.push({msg: 'Password should be at least 8 characters'});
    }

    if(errors.length > 0){
      res.render('register', {
        errors,
        name,
        username,
        email,
        password,
        password2
      });
    } else {
      // Create User
      let user = await User.create({ name: name, username: username, email: email, password: password }).fetch();

      if(user) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'damidev206@gmail.com',
            pass: 'd@M1l4R3!'
          }
        });

        var mailOptions = {
          from: 'no-reply@sailschat.com',
          to: user.email,
          subject: 'Welcome to Sails Chat',
          // text: 'You have been successfully registered, congrats!'
          html: '<h1>Welcome</h1><p>You have been successfully registered, congrats!</p>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }


      // Blast the message to all connected sockets.
      sails.sockets.blast('user', {
        verb: 'created',
        id: user.id,
        data: {
          email: user.email
        }
      });
    }

    sails.log('User created');
    passport.authenticate('local', (err, user, info) => {
      if((err) || (!user)) {
        res.redirect('/auth/register');
      }

      req.logIn(user, (err) => {
        if(err) { res.redirect('/'); }
        req.session.username = user.username;
        // console.log(user);
        res.redirect('/profile');
      });
    })(req, res);

  },

};

