// share.js
app = require('../app')
exports.share = function(req, res){
  var emails = req.body['emails'];
  console.log( emails);
  var changing = emails.map(function(val){return '<'+val+'>'});
  console.log(changing);
  var text = "This Pantry has been shared with you: "+req.protocol+"://"+req.host+"/pantry/"+req.session.pantry_id+'/name'
  console.log(text);

  app.server.send({
    text: text, 
    from:    "Pantry Founder <pantry.mailer@gmail.com>", 
    to:      changing.join(', '),
    // cc:      "else <else@gmail.com>",
    subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });
  
}