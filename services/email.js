var secrets = require('../config/secrets');
var mailgun = require('mailgun-js')({apiKey: secrets.mailgun.api_key, domain: secrets.mailgun.domain});
var _jade = require('jade');
var fs = require('fs');
var mailcomposer = require('mailcomposer');

var template = process.cwd() + '/services/email-template/alert.jade'

exports.sendEmailNotification = function(email_adress) {

  fs.readFile(template, 'utf8', function(err, file){
    if(err){
      console.log(err);
    }
    else {

      var compiledTmpl = _jade.compile(file);
      var context = {title: 'Express'};
      var html = compiledTmpl(context);

      var mail = mailcomposer({
        from: 'contact@mailzee.ovh',
        to: email_adress,
        subject: 'You have mail !',
        html: html
      });

      mail.build(function(mailBuildError, message) {

          var dataToSend = {
              to: email_adress,
              message: message.toString('utf8')
          };


          mailgun.messages().sendMime(dataToSend, function (sendError, body) {
              if (sendError) {
                  console.log(sendError);
                  return;
              }
          });
      });

    };

  });
}

function sendEmail(data) {
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
}
