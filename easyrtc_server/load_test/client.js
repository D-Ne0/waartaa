var io = require('socket.io/node_modules/socket.io-client');
var cpu = require('./cpu_usage');

var Client = function (nick) {

  var self = this;

  this.nick = nick;

  this.connectToServer = function (callback) {
    var client = io.connect(
        'http://'+SERVER_HOST+':'+SERVER_PORT ,
        {'force new connection': true}
    );
    if (!client) {
      throw "Couldn't connect to socket server";
    }

    self.client = client;

    var analysisData = {};

    var msg = {
      msgType: 'authenticate',
      msgData: {
        apiVersion: "1.0.11",
        applicationName: "waartaa"
      }
    };

    var easyrtcAuthCB = function (msg) {
      if (msg.msgType == 'error') {
        callback('easyrtc authentication falied for nick: ' + client.nick);
      } else {
        var endTime = new Date().getTime();
        // Time taken by client to connect to server
        analysisData.roundtripTime = endTime - startTime;
        cpu.getUsage(analysisData, callback);
        //self.sendMessage(analysisData, callback);
      }
    };

    client.on('easyrtcCmd', function (msg, ack) {
      //console.log(self.nick + ' received join room msg from');
    });

    client.on('easyrtcMsg', function (msg, ackAcceptorFunc) {
      console.log(self.nick+' received msg from ' + msg.msgData.nick);
    });

    var startTime = new Date().getTime();
    client.json.emit('easyrtcAuth', msg, easyrtcAuthCB);
  };

  this.sendMessage = function (analysisData, callback) {
    if (!self.client)
      throw "Not connected to easyrtc server.";

    var nick = self.nick;
    var msg = {
      msgType: 'userMsg',
      msgData: {
        nick: nick,
        time: new Date().getTime()
      },
      targetRoom: 'default'
    };

    var easyrtcMsgCB = function (msg) {
      if (msg.msgType == 'ack') {
        console.log('Message sent by nick: ' + nick);
        cpu.getUsage(analysisData, callback);
      } else {
        callback('Message not sent');
      }
    };

    this.client.json.emit('easyrtcMsg', msg, easyrtcMsgCB);
  };
}

exports.Client = Client;
