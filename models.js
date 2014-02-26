var mongoose = require('mongoose'), 
findOrCreate = require("mongoose-findorcreate");

var Schema = mongoose.Schema;

var pantrySchema = new Schema({
  name: {type: String, required: true},
  // description: String,
  items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
  requests: [{type: Schema.Types.ObjectId, ref: 'Request'}],
  invited_emails: [{type: String, required: true}],
  users: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

var itemSchema = new Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  expiration: Date,
  expiration_string: String,
  low: Boolean
});

var requestSchema = new Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  likes: Number
});

var userSchema = new Schema({
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  email:  {type: String, required: true},
  likes:  [{type: Schema.Types.ObjectId, ref: "Request"}],
  fid:    {type: String, required: true},
  visited: [{
    pantry: {type: Schema.Types.ObjectId, ref: 'Pantry'},
    date: { type: Date, default: Date.now }
  }]
  // pantries: [{type: Schema.Types.ObjectId, ref: "Pantry"}]
});

userSchema.plugin(findOrCreate);


exports.Pantry = mongoose.model('Pantry', pantrySchema);
exports.Item = mongoose.model('Item', itemSchema);
exports.Request = mongoose.model('Request', requestSchema);
exports.User = mongoose.model('User', userSchema);