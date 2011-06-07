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
    var cache = response.statusCode == 200;
    
    if(response.headers['cache-control']) {
      var tokens = response.headers['cache-control'].split(', ');
      for(var i in tokens) {
        if(tokens[i] == 'private' || tokens[i] == 'max-age=0') {
          cache = false;
        }
      }
    }
    
    if(cache) {
      self.cache.set(method + url, body);
    }
    else {
      console.log("[app] Prevent cache %s %s", method, url);
    }
  })
  
  self.listener.on('request', function(request, data, response) {
    var turl = self.router.match(request);
    
    //var cacheData = self.cache.get("GET" + routeUrl);

    //if(cacheData) {
    //  self.writeResponse(response, 200, cacheData);
    //  return;
    //}

    self.forwarder.send(turl, request, data, response);
  })
}

Shadows.prototype.writeResponse = function(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Length': body ? body.length : 0
  });  
  response.end(body, 'utf8');
}