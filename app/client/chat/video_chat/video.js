Template.video_chat.rendered = function () {
  if (typeof easyrtc === 'undefined') {
    return;
  }
  VideoChat.renderLocalStream();
  VideoChat.renderRemoteStream();
}

Template.video_chat.helpers({
  showLocalUsername: function () {
    var id = Session.get('selfEasyrtcId');
    if (id) {
      var username = easyrtc.idToName(id);
      var usernameHTML = '<i class="glyphicon glyphicon-user"></i>';
         usernameHTML += ' ' + username;
      return new Spacebars.SafeString(usernameHTML);
    } else {
      return '';
    }
  },

  showRemoteUsername: function () {
    var id = Session.get('otherEasyrtcId');
    if (id) {
      var username = easyrtc.idToName(id);
      var usernameHTML = '<i class="glyphicon glyphicon-user"></i>';
         usernameHTML += ' ' + username;
      return new Spacebars.SafeString(usernameHTML);
    } else {
      return '';
    }
  },

  showHangupButton: function () {
    var id = Session.get('otherEasyrtcId');
    if (id) {
      var buttonHTML = '<button type="button" class="btn hangup-btn red-btn"';
         buttonHTML += ' data-easyrtcid="'+id+'">Hangup</button>';
      return Spacebars.SafeString(buttonHTML);
    }
  },

  showTextChat: function () {
    var id = Session.get('otherEasyrtcId');
    if (id) {
      return true;
    } else {
      return false;
    }
  },

  videoTextChatMsgs: function () {
    var id = Session.get('otherEasyrtcId');
    if (id) {
      var msgs = Session.get('videoTextChatMsgs');
      if (msgs && msgs[id]) {
        return msgs[id];
      }
    }
    return [];
  },

  isCameraEnabled: function () {
    return Session.get('cameraEnabled') ? 'checked' : '';
  }
});

Template.video_chat.events({
  'click .hangup-btn': function (e) {
    var id = $(e.target).data('easyrtcid');
    VideoChat.hangup(id);
  },

  'click #enable-camera': function (e) {
    var enable = $(e.target).prop('checked');
    easyrtc.enableCamera(enable);
    Session.set('cameraEnabled', enable);
  },

  'keydown #video-chat-text-chat .input-box': function (e) {
    if (e.keyCode == 13) {
      var destUserId = Session.get('otherEasyrtcId');
      var msg = $('#video-chat-text-chat .input-box').val();
      VideoChat.sendChatMsg(destUserId, msg);
    }
  }
});
