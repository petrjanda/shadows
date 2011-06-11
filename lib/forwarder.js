/*
 * Module dependencies.
 */
var http = require('http'),
    sys = require('sys'),
    url = require('url'),
    events = require('events');

/*
 * Forwarder module
 *
 * Re-send detected client request to proper server which holds requested resource.
 * It does modify request headers to add additional information about proxy.
 */
var Forwarder = module.exports = function() {}
 
sys.inherits(Forwarder, events.EventEmitter);

/*
 * Forward request to the given url. Once request is made, data are directly streamed
 * to the response object which is closed once the full response is red from target
 * request.
 *
 * @param {url.URL}             URL object containing target information.
 * @param {http.serverRequest}  HTTP request to be forwarded.
 * @param {http.ServerResponse} Response to which request results will be written to.
 */ 
Forwarder.prototype.send = function(turl, request, response) {
  var self = this;
  
  request.headers = request.headers || {};
  
  request.headers['User-Agent'] = 'SHADOWS-proxy/0.0.0';
  request.headers['X-Powered-By'] = 'node.js';
  request.headers['X-Forwarded-For'] = request.connection.pair ? 'https' : 'http' + 
                                       request.connection.remoteAddress + ':' + 
                                       request.connection.remotePort;
  
  var options = {
    host: turl.hostname,
    port: turl.port,
    path: turl.pathname,
    method: request.method,
    headers: request.headers
  };
  
  var body = "";
  
  console.log('');
  console.log("[req] %s %s", request.method, options.path);  
  
  var req = http.request(options, function(res) {
    console.log("[res] %s %s %s", res.statusCode, request.method, options.path);

    if(res.statusCode == 302) {

      console.log("Redirect %s", res.headers.location);
      self.send(url.parse(res.headers.location), request, data, response);
      return;
    }
    
    response.writeHead(res.statusCode, res.headers);

    res.on('data', function (chunk) {
      response.write(chunk);
      body += chunk;
    });
    
    res.on('end', function(chunk) {
      body += chunk ? chunk : '';
      self.emit('response', req.method, url.format(turl), res, body);
      response.end(chunk);
    })
  });

  request.on('data', function(chunk) {
    req.write(chunk, 'utf8');
  })
  
  request.on('end', function(chunk) {
    req.end(chunk, 'utf8');
  })
}