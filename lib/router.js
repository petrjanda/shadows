/*
 * Router
 *
 * Options:
 * - routes {Object} Key-value pairs used for routing.
 */
var Router = module.exports = function(options) {
  var self = this;
  
  self.routes = options.routes;
}

Router.prototype = {
  /*
   * Method used to match incoming request and return the URL where 
   * it should be redirected. Override this method in case you would
   * like to implement your own routing mechanism.
   *
   * @param {http.serverReqest} Incoming request from the client side.
   * @return {url.URL} Target server URL.
   */
  match: function(request {
    var self = this;
    
    console.dir(request);
    
    var turl = url.parse(self.routes[request.headers.host]);
    return turl;
  })
}