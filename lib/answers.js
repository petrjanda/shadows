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
    console.log('404');
    var route = url.parse("http://localhost:3000/");
    //self.writeResponse(response, 404);
    forwarder.send(route, request.method, request.headers, request.data, response);
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