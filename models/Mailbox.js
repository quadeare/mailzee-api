var mongoose = require('mongoose');

var mailbox_schema = new mongoose.Schema({
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  name: { type: String, default: '' },
  sigfoxId: { type: String, default: '' },
  deviceId: { type: String, default: '' },
  deviceType: { type: String, default: '' },
  notifications: [{
    type: { type: String, default: '' },
    phone_number: { type: String },
    email: { type: String }
  }]
});


module.exports.Mailbox = mongoose.model('mailboxes', mailbox_schema);
