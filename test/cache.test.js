var assert = require('assert'),
    should = require('should'),
    Cache = require('cache.js');

module.exports = {
  
  set: function() {
    var cache = new Cache();
    cache.set('key', 'value');
    cache.data['key'].should.equal('value');
  },
  
  get: function() {
    var cache = new Cache();
    cache.data['key'] = 'value';
    cache.get('key').should.equal('value');
  },
  
  missCount: function() {
    var cache = new Cache();
    cache.get('key');
    cache.stats.attemps.should.equal(1);
  },
  
  hitCount: function() {
    var cache = new Cache();
    cache.set('key', 'value');
    cache.get('key');
    cache.stats.hits.should.equal(1);
  },
  
  respondHit: function() {
    var cache = new Cache();
    cache.set('href', 'value');
    cache.respond({href: 'href'}, {
      writeHead: function() {},
      write: function() {},
      end: function() {}
    }).should.equal(true);
  },
  
  respondFail: function() {
    var cache = new Cache();
    cache.set('href', 'value');
    cache.respond({href: 'hre'}, {
      writeHead: function() {},
      write: function() {},
      end: function() {}
    }).should.equal(false);
  }  
  
}