
var models = require('../models.js');
var helpers = require('../helpers.js');
var app  = require("../app");
exports.home = function(req, res){
  res.render('home');
};

exports.create = function (req, res) {
  var name = req.param('name');
  var invited_emails= req.param('invited_emails');
  var user = req.user;
  share_with(req, res, invited_emails);
  var new_pantry = new models.Pantry({
    name: name,
    users: [user._id],
  });
  
  new_pantry.save(function (err, new_pantry) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      req.session.pantry_order = 'Name';
      res.redirect('shopping_list/' + new_pantry._id + '/Name');
    }
  });
  
}

function share_with (req, res, emails_list) {
  if (emails_list) {
    var emails = emails_list.map(function(val){return '<'+val+'>'});
    var text = "This Pantry has been shared with you: "+req.protocol+"://"+req.host+"/pantry/"+req.session.pantry_id+'/name'
     console.log(emails);
     console.log(text);
    app.server.send({
      text: text, 
      from:    "Pantry Founder <pantry.mailer@gmail.com>", 
      to:      emails.join(', '),
      // cc:      "else <else@gmail.com>",
      subject: "A Pantry Has Been Shared With You"
    }, function(err, message) { 
      console.log(err || message); 
      res.json(err || message);
    });
  }
  else {

  }
}

exports.share = function(req, res){
  var emails_list = req.body['emails'];
  var pid = req.session.pantry_id;
  models.Pantry.findById(pid, function (err, found_pantry) {
    if (err) {helpers.error(err)};
    found_pantry.invited_emails.push().apply(invited_emails, emails_list);
  });
  share_with(req, res, emails_list);
};

exports.view = function (req, res) {
  var id = req.param('id');
  var order = req.param('order');
  req.session.pantry_id = id;
  req.session.pantry_order = order;

  models.Pantry
  .findById(id)
  .populate('items')
  .exec(function (err, found_pantry) {
    if (err) helpers.error(err);

    var items = found_pantry.items;

    items.sort(function (item1, item2) {
      if (order === 'Name') {
        return item1.name.localeCompare(item2.name);
      } else if (order === 'Category') {
        return item1.category.localeCompare(item2.category);
      } else {
        return item2.date - item1.date;
      }
    })

    res.render('pantry', 
    {user: req.user,
      items: items, 
      id:req.session.pantry_id,
      shopping_list_order: req.session.shopping_list_order,
      pantry_order: req.session.pantry_order});
  })
}

exports.create_item = function (req, res) {
  var name = req.param('name');
  var category = req.param('category');
  var expiration_string = req.param('expiration');
  var expiration = new Date(expiration_string);

  var new_item = new models.Item({
    name: name,
    category: category,
    expiration: expiration,
    expiration_string: expiration_string,
  })

  new_item.save(helpers.error);

  models.Pantry
  .findById(req.session.pantry_id, function (err, found_pantry) {
    if (err) helpers.error(err);

    found_pantry.items.push(new_item);
    found_pantry.save(helpers.error);
    res.redirect('pantry/'
                 + req.session.pantry_id + '/'
                 + req.session.pantry_order);
  })
}

exports.remove = function (req, res) {
  var id = req.param('id');

  console.log(id);

  models.Item
  .findById(id)
  .remove(helpers.error);

  res.send();
}
