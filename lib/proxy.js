var http = require('http'),
    events = require('events'),
    sys = require('sys'),
    url = require('url');

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
var Proxy = module.exports = function() {}

sys.inherits(Proxy, events.EventEmitter);

Proxy.prototype.listen = function(port) {
  var self = this;
  
  self.server = http.createServer(function(request, response) {
    
    if(!request.headers.host) {
      self.emit('routing_error', 'no_host');
      return;
    }
    
    self.emit('request', request, response);
  }).listen(port);
}