require('./const.js');
var fs = require('graceful-fs');
var async = require('async');
var Client = require('./client').Client;

// Process args
process.argv.forEach(function(val, index, array) {
  var argData = val.split('=');
  var argIndex = argData[0];
  var argValue = argData[1];
  switch (argIndex) {
    case '--no-of-connections':
      NO_OF_CONNECTIONS = argValue || NO_OF_CONNECTIONS;
      break;
    case '--no-of-concurrent-connections':
      NO_OF_CONCURRENT_CONNECTIONS = argValue || NO_OF_CONCURRENT_CONNECTIONS;
      break;
    case '--server-pid':
      SERVER_PID = argValue;
      break;
    case '--server-host':
      SERVER_HOST = argValue || SERVER_HOST;
      break;
    case '--server-port':
      SERVER_HOST = argValue || SERVER_HOST;
      break;
  }
});

function saveData(data) {
  var fileName = 'data/data_' + NO_OF_CONCURRENT_CONNECTIONS + '.csv';
  fs.writeFile(fileName, 'connection,roundtripTime,cpu,mem\n', function (err) {
  });
  for (var i=0; i<NO_OF_CONNECTIONS; i++) {
    var d = (i+1) + ','
              + data[i].roundtripTime + ','
              + data[i].cpuUsage.cpu + ','
              + parseInt(data[i].cpuUsage.memory/(1024*1024)) + '\n';
    fs.appendFile(fileName, d, function (err) {
      if (err)
        console.log(err);
    });
  }
  console.log('Complete!');
}

function run() {
  var i;
  var fnCalls = [];

  for (i=0; i<NO_OF_CONNECTIONS; i++) {
    var nick = 'user_' + i;
    var client = new Client(nick);
    fnCalls.push(client.connectToServer);
  }

  async.parallelLimit(fnCalls, NO_OF_CONCURRENT_CONNECTIONS, function (err, results) {
    if (err) {
      console.log(err);
      return;
    }
    saveData(results);
  });
}

run();
