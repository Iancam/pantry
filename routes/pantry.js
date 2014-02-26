
var models = require('../models.js');
var helpers = require('../helpers.js');

exports.home = function(req, res){
  console.log(req.protocol + '://' + req.get('host') + '/');
  res.render('home');
};

exports.create = function (req, res) {
  var name = req.param('name');
  var invited_emails= req.param('invited_emails');
  var user = req.user;
  var new_pantry = new models.Pantry({
    name: name,
    users: [user._id]
  });
  new_pantry.save(function (err, new_pantry) {
    if (err) {
      console.log(err);
      res.redirect('/');
    } else {
      req.session.pantry_order = 'Name';
      res.redirect('shopping_list/' + new_pantry._id + '/Name');
    }
  })
}

exports.share = function(req, res){
  var emails_list = req.body['emails'];
  var emails = emails_list.map(function(val){return '<'+val+'>'});
  var text = "This Pantry has been shared with you: "+req.protocol+"://"+req.host+"/pantry/"+req.session.pantry_id+'/name'
  app.server.send({
    text: text, 
    from:    "Pantry Founder <pantry.mailer@gmail.com>", 
    to:      emails.join(', '),
    // cc:      "else <else@gmail.com>",
    subject: "testing emailjs"
  }, function(err, message) { console.log(err || message); });
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
        console.log(item1.name);
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

// exports.new_item = function (req, res) {
//   res.render('new_item', 
//   {id: req.session.pantry_id,
//    shopping_list_order: req.session.shopping_list_order,
//    pantry_order: req.session.pantry_order});
// }

