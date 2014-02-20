// share.js
app = require('../app')
exports.share = function(req, res){
  var emails_raw = req.param('emails');
  var emails = emails_raw.split(/, /);
  // for (var i = 0; i < emails.length; i++) {
  //   res.mailer.send('../views/share_email', {
  //     to: emails[i], // REQUIRED. This can be a comma delimited string just like a normal email to field. 
  //     subject: 'A Pantry Has Been Shared With You!', // REQUIRED.
  //     otherProperty: {url:req.session.pantry_id} // All additional properties are also passed to the template as local variables.
  //     }, function (err) {
  //       if (err) {
  //       // handle error
  //       console.log(err);
  //       res.send('There was an error sending the email');
  //       return;
  //     }
  res.send('Email Sent');
  //     });
  // };
  
}