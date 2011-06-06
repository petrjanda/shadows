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