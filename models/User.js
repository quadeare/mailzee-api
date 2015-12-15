var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var user_schema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,

  tokens: [{
    kind: { type: String, default: '' },
    accessToken: { type: String, default: '' },
  }],
  mailboxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'mailboxes' }],


  refresh_tokens: Array,

  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});0

/**
 * Password hash middleware.
 */
user_schema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
user_schema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
user_schema.methods.gravatar = function(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  }
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
};


//Client
var client_schema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	clientId: {
		type: String,
		unique: true
	},
	clientSecret: {
		type: String,
		required: true
	}
});






module.exports.User = mongoose.model('User', user_schema);
module.exports.Client = mongoose.model('Client', client_schema);
