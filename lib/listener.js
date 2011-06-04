var sys = require('sys'),
    events = require('events');

var Listener = module.exports = function() {
  
}

sys.inherits(Listener, events.EventEmitter);

