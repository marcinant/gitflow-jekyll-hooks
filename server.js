var bs = require('browser-sync');
var bsconf = require('./bs-config.js');

process.title = process.argv[2];
console.log("server " + process.title);

bs.init(bsconf, function(){ console.log('bs')});
