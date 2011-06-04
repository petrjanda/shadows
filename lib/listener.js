var sys = require('sys'),
    http = require('http'),
    events = require('events');

/*
 * Component responsible to listen for incoming requests. Handle the necessary
 * check-up process for the incoming request and emit the event with request to
 * be handled by the proxy core.
 *
 * Events
 * routing_error - If there was the routing error encountered.
 *                 Additional field is passed along with more specific case type.
 * request - Valid request has been detected.
 */
var Listener = module.exports = function() {}

sys.inherits(Listener, events.EventEmitter);

Listener.prototype.listen = function(port) {
  var self = this;
  var data = "";
  
  self.server = http.createServer(function(request, response) {
    
    if(!request.headers.host) {
      self.emit('routing_error', 'no_host', request, response);
      return;
    }
    
    request.on('data', function(chunk) {
      data += chunk;
    })
    
    request.on('end', function(chunk) {
      data += chunk ? chunk : "";
      self.emit('request', request, data, response);
    })
  }).listen(port);
}
