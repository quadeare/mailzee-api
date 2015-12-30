var GCM = require('gcm').GCM;

var apiKey = 'AIzaSyAY1XJgpBiZM5kHBt19fjO28TpIkcoyCOY';
var gcm = new GCM(apiKey);

exports.sendGCMNotification = function(gcm_id) {
  var message = {
      registration_id: gcm_id, // required
      collapse_key: 'New Mail',
      'data.key1': 'value1',
      'data.key2': 'value2'
  };

  console.log(message);

  gcm.send(message, function(err, messageId){
      if (err) {
          console.log(err);
      } else {
          console.log("Sent with message ID: ", messageId);
      }
  });
};
