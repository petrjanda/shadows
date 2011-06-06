/*
 * Module dependencies.
 */
var url = require('url');

/*
 * Router
 *
 * Options:
 * - routes {Object} Key-value pairs used for routing.
 */
var Router = module.exports = function(options) {
  var self = this;
  
  self.routes = options.routes;
}

/*
 * Method used to match incoming request and return the URL where 
 * it should be redirected. Override this method in case you would
 * like to implement your own routing mechanism.
 *
 * @param {http.serverReqest} Incoming request from the client side.
 * @throw Error in case no route was found.
 * @return {url.URL} Target server URL.
 */
Router.prototype.match = function(request) {
  var self = this;
  
  try {
    var turl = url.parse('http://' + self.routes[request.headers.host]);
  } catch(e) {
    throw new Error('No route found for ' + request.headers.host + '.');
  }
  
  return turl;
}

