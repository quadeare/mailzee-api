var oauth2orize         = require('oauth2orize');
var passport            = require('passport');
var crypto              = require('crypto');

var User       			= require('../models/User').User;
var Client         	= require('../models/User').Client;

// Config file for authentification
var configAuth = {};

configAuth.token_expire = 2592000;

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Exchange username & password for access token.
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {

    User.findOne({ 'email' : username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

				user.comparePassword(password, function(err, isMatch) {
		      if (!isMatch) {
		        return done(err);
		      }
		    });

        var tokenValue = crypto.randomBytes(32).toString('hex');
        var refreshTokenValue = crypto.randomBytes(32).toString('hex');
				
				user.tokens.push({ kind: 'local', accessToken: tokenValue });
				user.refresh_tokens.push({ kind: 'local', refreshToken: refreshTokenValue });

        user.save(function (err, token) {
            if (err) { return done(err); }
            done(null, tokenValue, refreshTokenValue, { 'expires_in': configAuth.token_expire });
        });

    });
}));

// Exchange refreshToken for access token.
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {
    RefreshToken.findOne({ token: refreshToken }, function(err, token) {
        if (err) { return done(err); }
        if (!token) { return done(null, false); }
        if (!token) { return done(null, false); }

        User.findById(token.userId, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }

		        var tokenValue = crypto.randomBytes(32).toString('hex');
		        var refreshTokenValue = crypto.randomBytes(32).toString('hex');

						user.tokens.push({ kind: 'local', accessToken: tokenValue });
						user.refresh_tokens.push({ kind: 'local', refreshToken: refreshTokenValue });

		        var info = { scope: '*' }
		        user.save(function (err, token) {
		            if (err) { return done(err); }
		            done(null, tokenValue, refreshTokenValue, { 'expires_in': configAuth.token_expire });
		        });
        });
    });
}));

// token endpoint
exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    server.token(),
    server.errorHandler()
]
