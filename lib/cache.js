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

Cache.prototype.hit = function(method, url) {
  var self = this;
  self.stats.attemps++;
  
  var data = self.data[method + url];

  if(data) {
    self.stats.hits++;
    console.log("[cache] hit %s %s", method, url);  
  }
  else {
    console.log("[cache] miss %s %s", method, url);  
  }
  
  return data;
}

Cache.prototype.set = function(method, url, body) {
  console.log("[cache] set %s %s", method, url);
  
  var self = this;
  self.data[method + url] = body;
}