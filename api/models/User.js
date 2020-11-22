/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcryptjs');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      required: true,
      unique: true
    },

    username: {
      type: 'string',
      required: true,
      unique: true
    },

    avatar: {
      type: 'string',
      // required: true,
      defaultsTo: 'https://s.gravatar.com/avatar/e28f6f64608c970c663197d7fe1f5a59?s=60'
    },

    location: {
      type: 'string',
      required: false,
      defaultsTo: ''
    },

    bio: {
      type: 'string',
      required: false,
      defaultsTo:''
    },

    online: {
      type: 'boolean',
      defaultsTo: true
    },

    chatmessages: {
      collection:'chatmessage',
      via: 'createdBy'
    },

    password: {
      type: 'string',
      required: false
    },

  },

  customToJSON: function() {
    return _.omit(this, ['password']);
  },

  beforeCreate: function(user, cb){
    // eslint-disable-next-line handle-callback-err
    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) { return cb(err); }
      user.password = hash;
      return cb();
    }));
  },


};


