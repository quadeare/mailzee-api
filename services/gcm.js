var GCM = require('gcm').GCM;

var apiKey = 'AIzaSyDsFyJg-4y-WHCVyRQPn7Xff7JL7YgasAM';
var gcm = new GCM(apiKey);

exports.sendGCMNotification = function(gcm_id) {
  var message = {
      registration_id: gcm_id, // required
      collapse_key: 'New Mail'
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
