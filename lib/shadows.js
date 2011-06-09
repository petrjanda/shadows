var url = require('url'),
    Forwarder = require('./forwarder'),
    Cache = require('./cache'),
    Router = require('./router'),
    Listener = require('./listener');

/*
 * SHADOWS | HTTP proxy
 *
 * Options
 * - routes {Object} Key-value pairs used for routing.
 * - port {Number} Port number where proxy will start.
 */
var Shadows = module.exports = function(options) {
  var self = this;
  
  options = options || {};
  
  self.router = new Router({routes: options.routes});

  self.listener = new Listener().listen(options.port);

  self.cache = new Cache();

  self.forwarder = new Forwarder();
  
  self.forwarder.on('response', function(method, url, response, body) {
    if(!self.cache.response(method, url, response, body)) {
      console.log("[app] Prevent cache %s %s", method, url);
    }
  })
  
  self.listener.on('request', function(request, data, response) {
    var turl = self.router.match(request);
    
    if(!self.cache.respond(turl, response)) {
      self.forwarder.send(turl, request, data, response);
    }
  })
}