var forever = require('forever-monitor');
 
  var child = new (forever.Monitor)('server.js', {
    max: 1000000000000000000000000000000000000000000000000000,
    silent: true,
    args: []
  });
 
  child.on('exit', function () {
    console.log('your-filename.js has exited after all the restarts');
  });
 
  child.start();