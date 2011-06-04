var http = require('http');

/*
 * Forward request to the given url. Once request is made, data are directly streamed
 * to the response object which is closed once the full response is red from target
 * request.
 *
 * @param {url.URL}             URL object containing target information.
 * @param {String}              HTTP request method to be used for the request.
 * @param {Array}               Array of key/value pairs to be sent as headers along with request.
 * @param {http.ServerResponse} Response to which request results will be written to.
 */
exports.send = function(url, method, headers, response) {
  var options = {
    host: url.hostname,
    port: url.port,
    path: url.pathname,
    method: method,
    headers: headers || {}
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
}