/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'dwtdarey',
  api_key: '168396691584195',
  api_secret: 'KY_x2njap1Kz5Fj1skMEcn6wb80'
});


module.exports = {

  render: async (request, response) => {
    try {
      /* let data = await User.findOne({
        // email: 'johnnie86@gmail.com'
        // email: 'peter.quinn@live.com'
        // email: 'jane@hotmail.com'
        id:request.session.userId

      }); */

      let data = await User.findOne({ email:request.user.email });

      if (!data) {
        return response.notFound('The user was NOT found!');
      }
      response.view('profile', { data });
    } catch (err) {
      response.serverError(err);
    }
  },


  imgupload: (req, res) => {
    req.file('image').upload((err, uploadedFiles) => {
      if (err) {
        return res.send(500, err);
      } else {
        cloudinary.uploader.upload(uploadedFiles[0].fd, async (result) => {
          /* User.update(req.param('id'), {avatar: result.url}, function imageUpdated(err) {
            if (err) {
              console.log(err);
              return res.redirect('/');
            }
            res.redirect('/image/upload/' + req.param('id'));
          }); */
          let updatedUser = await User.updateOne({ username:req.session.username })
          .set({ avatar: result.url });

          if (updatedUser) {
            sails.log('Updated the user avatar.');

            // Blast the message to all connected sockets.
            sails.sockets.blast('user', {
              verb: 'updated',
              id: updatedUser.id,
              data: {
                email: updatedUser.email
              }
            });

            res.redirect('/profile');

          } else{
            sails.log('Unsuccessful.');
          }
        });
      }
    });
  },


  profileupdate: async (req, res) => {

    var updatedUser = await User.updateOne({ username:req.session.username })
    .set({ name: req.body.name, location: req.body.location, bio: req.body.bio });

    if (updatedUser) {
      sails.log('Updated the user main profile.');
      res.redirect('/profile');

    } else{
      sails.log('Updating main profile was unsuccessful.');
    }
  },


};


