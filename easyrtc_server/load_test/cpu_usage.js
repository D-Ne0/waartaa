var usage = require('usage');

usage.clearHistory();

var getUsage = function (analysisData, callback) {
  if (!SERVER_PID) {
    callback(null, analysisData);
    return;
  }

  // set keepHistory  true for current cpu usage
  // otherwise false for average cpu usage
  var options = {keepHistory: false};
  usage.lookup(parseInt(SERVER_PID), options, function (err, usageInfo) {
    if (err) {
      callback(err);
    } else {
      analysisData.cpuUsage = usageInfo;
      callback(null, analysisData);
    }
  });
};

exports.getUsage = getUsage;
