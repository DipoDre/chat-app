/**
 * ChatMessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  render: (request, response) => {
    return response.view('chatroom');
  },

  postMessage: async (request, response) => {
    // Make sure this is a socket request (not traditional HTTP)

    console.log(request.session.username);

    if (!request.isSocket) {
      return response.badRequest();
    }

    try {
      // let user = await User.findOne({email:'johnnie86@gmail.com'});
      let user = await User.findOne({ username:request.session.username });
      // let allUsers = await User.find();

      // await ChatMessage.create({message:request.body.message, createdBy:user.id });
      let message = await ChatMessage.create({message:request.body.message, createdBy:user.id }).fetch();
      console.log('done');
      // Blast the message to all connected sockets.
      sails.sockets.blast('chatmessage', {
        verb: 'created',
        id: message.id,
        data: {
          text: message.text
        }
      });
      // let msg = await ChatMessage.create({message:request.body.message, createdBy:user.id }).fetch();

      // if(!msg.id) {
      //   throw new Error('Message processing failed!');
      // }
      // msg.createdBy = user;
      // ChatMessage.publish(_.pluck(allUsers, 'id'), msg);
      // return response.send();
    } catch(err) {
      return response.serverError(err);
    }
    console.log('step 55');
    return response.ok();
  }

};

