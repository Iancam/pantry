// share.js
app = require('../app')
exports.share = function(req, res){
  var emails = req.body['emails'];
  console.log( emails);
  var changing = emails.map(function(val){return '<'+val+'>'});
  console.log(changing);
  var message = "success mother fucker!";
  app.server.send({
    text:    "This url has been shared with you:\n ", 
    from:    "Pantry Founder <pantry.mailer@gmail.com>", 
    to:      changing.join(', '),
    // cc:      "else <else@gmail.com>",
    subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });
  
}