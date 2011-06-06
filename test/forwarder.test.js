var http = require('http'),
    Forwarder = require('forwarder'),
    url = require('url'),
    assert = require('assert');

module.exports = {
  send: function(beforeExit) {
    var self = this;
    var target = http.createServer(function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello world\n');
    });

    target.listen(1337);

    var forwarder = new Forwarder();
    var turl = url.parse("http://127.0.0.1:1337");

    var proxy = http.createServer(function(request, response) {
      forwarder.send(turl, request, '', response);
    });
    
    assert.response(proxy, {url: '/', timeout: 500}, {body: 'Hello world\n'});
    
    setTimeout(function() {
      target.close();
    }, 500);
  }
}