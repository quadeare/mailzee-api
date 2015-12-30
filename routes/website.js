/**
 * Primary app routes.
 */
module.exports = function(app, oauth2, passport, homeController, userController, passportConf, contactController, mailboxController) {

  app.get('/', homeController.index);

  app.get('/login', userController.getLogin);
  app.post('/login', userController.postLogin);
  app.get('/logout', userController.logout);
  app.get('/forgot', userController.getForgot);
  app.post('/forgot', userController.postForgot);
  app.get('/reset/:token', userController.getReset);
  app.post('/reset/:token', userController.postReset);
  app.get('/signup', userController.getSignup);
  app.post('/signup', userController.postSignup);
  app.get('/contact', contactController.getContact);
  app.post('/contact', contactController.postContact);
  app.get('/account', passportConf.isAuthenticated, userController.getAccount);
  app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
  app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
  app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
  app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);


  app.get('/mailbox/list', loggedIn, mailboxController.index);


  app.get('/mailbox/:id/notifications', loggedIn, mailboxController.notificationsMailBox);
  app.get('/mailbox/:id/edit', loggedIn, mailboxController.editMailBox);

  app.get('/mailbox/:id/notification/sms', loggedIn, mailboxController.smsNotifMailBox);
  app.get('/mailbox/:id/notification/email', loggedIn, mailboxController.emailNotifMailBox);
  app.get('/mailbox/:id/notification/gcm', loggedIn, mailboxController.gcmNotifMailBox);

  app.post('/mailbox/:id/notification/sms', loggedIn, mailboxController.addSMSNotification);
  app.post('/mailbox/:id/notification/email', loggedIn, mailboxController.addEmailNotification);
  app.post('/mailbox/:id/notification/gcm', loggedIn, mailboxController.addGCMNotification);

  app.delete('/mailbox/notification/', loggedIn, mailboxController.removeNotification);

  app.post('/mailbox/newmail/sigfox/:sigfoxId/:data/', mailboxController.sigfoxNewMail);


  app.post('/mailbox', loggedIn, mailboxController.addMailBox);
  app.delete('/mailbox', loggedIn, mailboxController.removeMailBox);

  app.get('/form-add-mailbox', loggedIn, mailboxController.addMailBoxForm);

  function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

}
