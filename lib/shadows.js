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
  
  /*
   * Router for URL matching between client and resource host.
   */
  self.router = new Router({routes: options.routes});

  /*
   * Detector of the client requests.
   */
  self.listener = new Listener().listen(options.port);

  /*
   * Module for caching the server responses.
   */
  self.cache = new Cache();

  /*
   * All requests non server by cache are proxied with forwarder to
   * target server.
   */
  self.forwarder = new Forwarder();
  
  // Cache the resource server response (if possible).
  self.forwarder.on('response', function(method, url, response, body) {
    if(!self.cache.response(method, url, response, body)) {
      console.log("[app] Prevent cache %s %s", method, url);
    }
  })
  
  // Server the client request (from cache if possible, forward otherwise).
  self.listener.on('request', function(request, data, response) {
    var turl = self.router.match(request);

    if(!self.cache.respond(turl, response)) {
      self.forwarder.send(turl, request, data, response);
    }
  })
}