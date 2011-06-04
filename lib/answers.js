var url = require('url'),
    forwarder = require('./forwarder'),
    Listener = require('./listener');

/*
 * SHADOW | HTTP Caching proxy
 *
 */

var Answers = module.exports = function() {
  var self = this;
  
  self.listener = new Listener();
  self.listener.listen(8000);
  
  self.listener.on('request', function(request, response) {
    var route = url.parse("http://localhost:3000/");
    forwarder.send(route, request.method, request.headers, request.data, response);
  })
  
  self.listener.on('route_error', function(code, request, response) {
    self.writeResponse(response, 500, 'Internal server error');
  })
}

Answers.prototype.writeResponse = function(response, statusCode, jsonBody) {
  var body = JSON.stringify(jsonBody);
  response.writeHead(statusCode, {
    'Content-Length': body ? body.length : 0,
    'Content-Type': 'application/json' 
  });  
  response.end(body, 'utf8');
}

new Answers();