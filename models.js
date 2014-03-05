var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var pantrySchema = new Schema({
  name: {type: String, required: true},
  items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
  requests: [{type: Schema.Types.ObjectId, ref: 'Request'}],
});

var itemSchema = new Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  expiration: String
});

var requestSchema = new Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  likes: Number
});

var userSchema = new Schema({
  fid: {type: String, required: true},
  email: {type: String, required: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  pantries: [{type: Schema.Types.ObjectId, ref: "Pantry"}],
  voted: [{type: Schema.Types.ObjectId, ref: "Request"}]
});

exports.Pantry = mongoose.model('Pantry', pantrySchema);
exports.Item = mongoose.model('Item', itemSchema);
exports.Request = mongoose.model('Request', requestSchema);
exports.User = mongoose.model('User', userSchema);