/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'homepage' },
  'POST /user': 'AuthController.adduser',
  '/profile': { controller: 'UserController', action: 'render' },
  '/chat': { controller: 'ChatMessageController', action: 'render' },
  '/postMessage': { controller: 'ChatMessageController', action: 'postMessage' },

  'POST /auth/authenticate': 'AuthController.login',
  '/auth/logout': 'AuthController.logout',
  'GET /auth/register': { view: 'register' },
  'GET /user/avatar': { view: 'avatar' },
  'POST /user/avatar': 'UserController.imgupload',
  'POST /user/update': 'UserController.profileupdate',


  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};

