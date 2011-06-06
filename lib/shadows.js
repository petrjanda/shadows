var url = require('url'),
    Forwarder = require('./forwarder'),
    Cache = require('./cache'),
    Listener = require('./listener');

/*
 * HTTP proxy
 *
 */

var Shadows = module.exports = function() {
  var self = this;
  
  self.listener = new Listener();
  self.listener.listen(8000);
  
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
    var start = new Date().getTime();
    
    var requestUrl = "http://" + request.headers.host + request.url;
    var routeUrl = "http://localhost:3000"  + request.url;
    var route = url.parse(routeUrl);
    var cacheData = self.cache.get("GET" + routeUrl);

    if(cacheData) {
      self.writeResponse(response, 200, cacheData);
      return;
    }
    
    request.headers.host = "localhost:3000";
    
    self.forwarder.send(route, request, data, response);
  })
  
  self.listener.on('route_error', function(code, request, response) {
    self.writeResponse(response, 500, 'Internal server error');
  })
}

Shadows.prototype.writeResponse = function(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Length': body ? body.length : 0
  });  
  response.end(body, 'utf8');
}

new Shadows();