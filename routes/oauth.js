/**
 * API examples routes.
 */

module.exports = function(app, oauth2, passport, apiController, passportConf) {

  app.get('/oauth', apiController.getApi);
  app.get('/oauth/lastfm', apiController.getLastfm);
  app.get('/oauth/nyt', apiController.getNewYorkTimes);
  app.get('/oauth/aviary', apiController.getAviary);
  app.get('/oauth/steam', apiController.getSteam);
  app.get('/oauth/stripe', apiController.getStripe);
  app.post('/oauth/stripe', apiController.postStripe);
  app.get('/oauth/scraping', apiController.getScraping);
  app.get('/oauth/twilio', apiController.getTwilio);
  app.post('/oauth/twilio', apiController.postTwilio);
  app.get('/oauth/clockwork', apiController.getClockwork);
  app.post('/oauth/clockwork', apiController.postClockwork);
  app.get('/oauth/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
  app.get('/oauth/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
  app.get('/oauth/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
  app.get('/oauth/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
  app.get('/oauth/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
  app.post('/oauth/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postTwitter);
  app.get('/oauth/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
  app.post('/oauth/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
  app.get('/oauth/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
  app.get('/oauth/instagram', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getInstagram);
  app.get('/oauth/yahoo', apiController.getYahoo);
  app.get('/oauth/paypal', apiController.getPayPal);
  app.get('/oauth/paypal/success', apiController.getPayPalSuccess);
  app.get('/oauth/paypal/cancel', apiController.getPayPalCancel);
  app.get('/oauth/lob', apiController.getLob);
  app.get('/oauth/bitgo', apiController.getBitGo);
  app.post('/oauth/bitgo', apiController.postBitGo);


  	/**
  	 * @api {post} /oauth/token Get Oauth2 Token
  	 * @apiName Get the token !
  	 * @apiGroup OAuth2
  	 *
  	 * @apiParam {String} grant_type Grant Type (password or refresh_token)
  	 * @apiParam {String} username Username *only for Grant Type : password
  	 * @apiParam {String} password Password *only for Grant Type : password
  	 * @apiParam {String} client_id Client ID (For example Android)
  	 * @apiParam {String} client_secret Client Secret (For example Android)
  	 * @apiParam {String} refresh_token Refresh Token *only for Grant Type : refresh_token
  	 *
  	 * @apiSuccess {String} access_token Access token of the User.
  	 * @apiSuccess {String} refresh_token  Refresh token of the User.
  	 * @apiSuccess {String} expires_in  The expiry date of the token.
  	 * @apiSuccess {String} token_type  Token Type.
  	 *
  	 * @apiSuccessExample Success-Response:
  	 *     HTTP/1.1 200 OK
  	 *     {
  	 *	    "access_token": "N78d+5dtmfsSHs4ELhk2HcQS4/sUnBdJr7tiXRKwdtE=",
  	 *	    "refresh_token": "P0naIJ2RKRc6zQXyKxcRQP4m6sluR7vN2GnwyXR4nmk=",
  	 *	    "expires_in": 3600,
  	 *	    "token_type": "Bearer"
  	 *		}
  	 */

  	app.post('/oauth/token', oauth2.token);

  /**
   * OAuth authentication routes. (Sign in)
   */
  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/github', passport.authenticate('github'));
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });
  app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
  app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
    res.redirect(req.session.returnTo || '/');
  });

  /**
   * OAuth authorization routes. (API examples)
   */
  app.get('/auth/foursquare', passport.authorize('foursquare'));
  app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/oauth' }), function(req, res) {
    res.redirect('/oauth/foursquare');
  });
  app.get('/auth/tumblr', passport.authorize('tumblr'));
  app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/oauth' }), function(req, res) {
    res.redirect('/oauth/tumblr');
  });
  app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
  app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/oauth' }), function(req, res) {
    res.redirect('/oauth/venmo');
  });

}
