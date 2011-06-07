/*
 * Cache module.
 */
var Cache = module.exports = function() {
  var self = this;
  self.data = {};
  
  self.stats = {
    attemps: 0,
    hits: 0
  };
}

Cache.prototype.get = function(key) {
  var self = this;
  self.stats.attemps++;
  
  var data = self.data[key];

  if(data) {
    self.stats.hits++;
    //console.log("[cache] hit %s %s", method, url);  
  }
  else {
    //console.log("[cache] miss %s %s", method, url);  
  }
  
  return data;
}

Cache.prototype.set = function(key, value) {
  //console.log("[cache] set %s %s", method, url);
  
  var self = this;
  self.data[key] = value;
}

/* 
 * Respond to the given url and response object, if there are cached
 * data found in the storage. If no data is found, false is returned.
 * In case there is entry in cache, proper response is generated and
 * true is returned as method result.
 *
 * @param {url.URL} URL parsed object with request route informations.
 * @param {http.serverResponse} Which should contain data as the result
 *                              of the request.
 */
Cache.prototype.respond = function(turl, response) {
  var self = this,
      data = self.get(turl.href);
  
  if(!data)
    return false;
    
  response.writeHead(200, {'Content-Length': data.length, 'Content-Type': 'text/plain'});
  response.write(data, 'utf8');
  response.end();
  
  return true;
}