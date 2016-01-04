var secrets = require('../config/secrets');
var mailgun = require('mailgun-js')({apiKey: secrets.mailgun.api_key, domain: secrets.mailgun.domain});
var _jade = require('jade');
var fs = require('fs');
var mailcomposer = require('mailcomposer');

var template = process.cwd() + '/services/email-template/alert.jade'

exports.sendEmailNotification = function(email_adress) {

  fs.readFile(template, 'ascii', function(err, file){
    if(err){
      console.log(err);
    }
    else {

      var compiledTmpl = _jade.compile(file);
      var context = {title: 'Express'};
      var html = compiledTmpl(context);
      var alternatives = [{content:"contents of alternative", contentEncoding:"7bit", contentType:"text/calendar"}];

      //console.log(html);

      var mail = mailcomposer({
        from: 'contact@mailzee.ovh',
        to: email_adress,
        subject: 'You have mail !',
        contentEncoding: '7bit',
        html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"><head><!-- If you delete this meta tag, Half Life 3 will never be released.--><meta name="viewport" content="width=device-width"/><title>ZURBemails</title>'
      });

      mail.build(function(mailBuildError, message) {

          var dataToSend = {
              to: email_adress,
              message: message.toString('ascii')
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
