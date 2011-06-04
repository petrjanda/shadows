var url = require('url'),
    Forwarder = require('./forwarder'),
    Cache = require('./cache'),
    Listener = require('./listener');

/*
 * HTTP proxy
 *
 */

var Answers = module.exports = function() {
  
  self.listener = new Listener();
  self.listener.listen(8000);
  
  self.cache = new Cache();
  
  self.forwarder = new Forwarder();
  
  self.forwarder.on('response', function(response, body) {
    self.cache.set('GET', 'http://localhost:3000/', body);
  })
  
  self.listener.on('request', function(request, response) {
    var start = new Date().getTime();

    var route = url.parse("http://localhost:3000/");
    
    var cacheData = self.cache.hit("GET", "http://localhost:3000/")
    
    if(cacheData) {
      self.writeResponse(response, 200, cacheData);
      return;
    }
    
    self.forwarder.send(route, request.method, request.headers, request.data, response);
  })
  
  self.listener.on('route_error', function(code, request, response) {
    self.writeResponse(response, 500, 'Internal server error');
  })
}

Answers.prototype.writeResponse = function(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Length': body ? body.length : 0
  });  
  response.end(body, 'utf8');
}

new Answers();
