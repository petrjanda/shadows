var http = require('http'),
    fs = require('fs'),
    events = require('events'),
    sys = require('sys'),
    url = require('url'),
    Log = require('log');

/*
 * Proxy.
 * 
 * Proxy server able to route traffic to multiple another locations based
 * on the request headers.
 *
 * Options
 *  port - Port to start HTTP proxy. Default is 80.
 *  domains - List of the routing rules in format "domain": "url".
 */
var Proxy = module.exports = function() {
  var self = this;

  // List of domain rules.
  self.domains = {};
}

sys.inherits(Proxy, events.EventEmitter);

Proxy.prototype.addRule = function(domain, url) {
  var self = this;
  
  self.domains[domain] = url;
}

Proxy.prototype.listen = function(port) {
  var self = this;
  
  self.server = http.createServer(function(request, response) {
    
    if(!request.headers.host) {
      self.emit('routing_error', '500 Request doesn\'t have location header');
      self.writeResponse(response, 500, 'No location header');
      return;
    }
    
    self.emit('request', request.method + ' ' + request.headers.host + request.url);


    var hostname = self.domains[request.headers.host.split(':').shift()];
    var turl = url.parse('http://' + hostname + request.url);

    // Throw error in case there was no rule found.
    if(!hostname) {
      self.emit('routing_error', '500 ' + request.method + ' ' + request.headers.host + request.url + ' No route matches');
      self.writeResponse(response, 500, 'No route matches');
      return;
    }
    
    request.headers['x-forwarded-url'] = request.connection.remoteAddress;
    request.headers['x-forwarded-port'] = request.connection.remotePort;
    request.headers['x-forwarded-protocol'] = request.connection.pair ? 'https' : 'http';
    
    var options = {
      host: turl.hostname,
      port: turl.port,
      path: turl.pathname,
      method: request.method,
      headers: request.headers
    };
        
    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      
      res.on('data', function (chunk) {
        response.write(chunk);
      });
      
      res.on('end', function() {
        response.end();
      })
    });

    // write data to request body
    req.end(request.data, 'utf8');

  }).listen(port);
}

Proxy.prototype.writeResponse = function(response, statusCode, jsonBody) {
  var body = JSON.stringify(jsonBody);
  response.writeHead(statusCode, {
    'Content-Length': body.length,
    'Content-Type': 'application/json' 
  });  
  response.end(body, 'utf8');
}