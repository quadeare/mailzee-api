var request = require('request');

exports.sendSMSNotification = function(phone_number, message, res) {

  request.post(
      'http://smsgateway.me/api/v3/messages/send',
      { form: {
        email: 'lacrampe.florian@gmail.com',
        password: 'lc6550',
        device: '18016',
        number:  phone_number,
        message: message
      } },
      function (error, response, body) {
          if (!error && response.statusCode == 200) {

          }
      }
  );

};
