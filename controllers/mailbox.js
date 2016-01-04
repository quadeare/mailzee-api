var User = require('../models/User').User;
var Mailbox = require('../models/Mailbox').Mailbox;

var smsServices = require('../services/sms');
var gcmServices = require('../services/gcm');
var emailServices = require('../services/email');

/**
 * POST /signup
 * Create a new local account.
 */
exports.addMailBox = function(req, res, next) {
  //req.assert('deviceType', 'Device Type is not valid').len(4);
  req.assert('mailboxName', 'Device ID is not valid').len(4);
  //req.assert('deviceId', 'Device ID is not valid').len(4);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/mailbox/list');
  }

  var mailbox = new Mailbox();

	mailbox.user = req.user.id;
	mailbox.deviceType = req.body.deviceType;
  mailbox.name = req.body.mailboxName;
  mailbox.deviceId = req.body.deviceId;
  mailbox.sigfoxId = req.body.sigfoxId;

	mailbox.save(function (err) {
		if (err) {
			res.status(500) && res.json(err);
		} else {

      User.findById(req.user.id, function(err, user) {
        if (err) {
          return next(err);
        }

        user.mailboxes.push({ _id: mailbox._id });

        user.save(function(err) {
          if (err) {
            return next(err);
          }
          req.flash('success', { msg: 'Success! You have register a new mailbox.' });
          res.redirect(req.session.returnTo || '/mailbox/list');
        });
      });

		}
	});

};


exports.index = function(req, res) {
    User.findById(req.user.id)
    .populate('mailboxes')

    .exec(function (err, user) {
      res.render('mailbox/list-mailbox', {
        title: 'Mailbox',
        user: user
      });
    })
};

exports.addMailBoxForm = function(req, res) {
    res.render('mailbox/add-mailbox-form', {
      title: 'Mailbox'
    });
};

exports.removeMailBox = function(req, res, next) {

  var condition = {
    _id: req.body.id,
    user: req.user.id
  }

  Mailbox.remove(condition, function(err) {
    if (err) {
      req.flash('errors', { msg: err });
    }else{

      User.findById(req.user.id)
      .exec(function (err, user) {
      user.update(
        { $pull: { mailboxes : { _id : req.body.id } } },
        { safe: true },
        function removeConnectionsCB(err, obj) {
          if (err) {
            req.flash('errors', { msg: err });
          }else{
            req.flash('success', { msg: "Mailbox has been deleted" });
          }

          res.redirect('/mailbox/list');
        }
      );
    })
  }

});

};


exports.notificationsMailBox = function(req, res) {

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    res.render('mailbox/notifications-mailbox', {
      title: 'Mailbox',
      subtitle: 'Notifications',
      mailbox: mailbox
    });
  })

};


exports.editMailBox = function(req, res) {

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    res.render('mailbox/edit-mailbox', {
      title: 'Mailbox',
      subtitle: 'Edit',
      mailbox: mailbox
    });

    })

};

exports.smsNotifMailBox = function(req, res) {

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    res.render('mailbox/add-mailbox-sms-notification-form', {
      title: 'Mailbox',
      subtitle: 'Notifications',
      mailbox: mailbox
    });

  })

};

exports.emailNotifMailBox = function(req, res) {

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    res.render('mailbox/add-mailbox-email-notification-form', {
      title: 'Mailbox',
      subtitle: 'Notifications',
      mailbox: mailbox
    });

    })

};


exports.gcmNotifMailBox = function(req, res) {

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    res.render('mailbox/add-mailbox-gcm-notification-form', {
      title: 'Mailbox',
      subtitle: 'GCM',
      mailbox: mailbox
    });

    })

};

exports.chromeNotifMailBox = function(req, res) {

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    res.render('mailbox/add-mailbox-chrome-notification-form', {
      title: 'Mailbox',
      subtitle: 'GCM',
      mailbox: mailbox
    });

    })

};

exports.addSMSNotification = function(req, res, next) {

  req.assert('phone_number', 'Phone Number is not valid').notEmpty();
  req.assert('owner_name', 'Owner Name is not valid').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/mailbox/list');
  }

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    mailbox.notifications.push({ type: "sms", owner_name: req.body.owner_name, phone_number: req.body.phone_number });

    mailbox.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You have added a new sms notification.' });
      res.redirect(req.session.returnTo || '/mailbox/'+req.params.id+'/notifications');
    });
  })

};

exports.addEmailNotification = function(req, res, next) {

  req.assert('email', 'Email is not valid').notEmpty();
  req.assert('owner_name', 'Owner Name is not valid').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/mailbox/list');
  }

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    mailbox.notifications.push({ type: "email", owner_name: req.body.owner_name, email: req.body.email });

    mailbox.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You have added a new email notification.' });
      res.redirect(req.session.returnTo || '/mailbox/'+req.params.id+'/notifications');
    });
  });

};

exports.addChromeNotification = function(req, res, next) {

  req.assert('gcm_id', 'Chrome GCM ID is not valid').notEmpty();
  req.assert('owner_name', 'Owner Name is not valid').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/mailbox/list');
  }

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    mailbox.notifications.push({ type: "chrome_gcm", owner_name: req.body.owner_name, gcm_id: req.body.gcm_id });

    mailbox.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You have added a new GCM notification.' });
      res.redirect(req.session.returnTo || '/mailbox/'+req.params.id+'/notifications');
    });
  });

};

exports.addGCMNotification = function(req, res, next) {

  req.assert('gcm_id', 'GCM ID is not valid').notEmpty();
  req.assert('owner_name', 'Owner Name is not valid').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/mailbox/list');
  }

  var condition = {
    _id: req.params.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    mailbox.notifications.push({ type: "android_gcm", owner_name: req.body.owner_name, gcm_id: req.body.gcm_id });

    mailbox.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You have added a new GCM notification.' });
      res.redirect(req.session.returnTo || '/mailbox/'+req.params.id+'/notifications');
    });
  });

};

exports.removeNotification = function(req, res, next) {

  var condition = {
    _id: req.body.id,
    user: req.user.id
  }

  Mailbox.findOne(condition, function(err, mailbox) {

    mailbox.update(
      { $pull: { notifications : { _id : req.body.id_notification } } },
      { safe: true },
      function removeConnectionsCB(err, obj) {
        if (err) {
          req.flash('errors', { msg: err });
        }else{
          req.flash('success', { msg: "Notification has been deleted" });
        }

        res.redirect('/mailbox/' + req.body.id + '/notifications');
      });
})

}



exports.sigfoxNewMail = function(req, res, next) {

  var sigfoxId = req.params.sigfoxId;
  var data = hex2a(req.params.data);

  var regex = new RegExp('(\\d+).*?(\\d+)',["i"]);
  var m = regex.exec(data);

  var deviceId=m[1];
  var instructionId=m[2];

  var condition = {
    deviceType: "sigfox",
    sigfoxId: sigfoxId,
    deviceId: deviceId
  }

  Mailbox.find(condition, function(err, mailboxes) {



    if (!mailboxes) {
      res.status(404).send('Not found');
    }else{

      mailboxes.forEach(function (mailbox) {

        var notifications = mailbox.notifications;

        notifications.forEach(function (notification) {
          if (notification.type == 'sms') {
            smsServices.sendSMSNotification(notification.phone_number, "You have mail !");
          }
          if (notification.type == 'email') {
            emailServices.sendEmailNotification(notification.email, res)
          }
          if (notification.type == 'android_gcm') {
            gcmServices.sendGCMNotification(notification.gcm_id);
          }
          if (notification.type == 'chrome_gcm') {
            gcmServices.sendGCMNotification(notification.gcm_id);
          }
        })
    })

      res.send();

    }
  })

}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
