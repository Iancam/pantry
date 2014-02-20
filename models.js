var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var pantrySchema = new Schema({
  name: {type: String, required: true, unique: true},
  items: [{type: Schema.Types.ObjectId, ref: 'Item'}],
  requests: [{type: Schema.Types.ObjectId, ref: 'Request'}]
})

var itemSchema = new Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  expiration: Date,
  low: Boolean
})

var requestSchema = new Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  likes: Number
})

exports.Pantry = mongoose.model('Pantry', pantrySchema);
exports.Item = mongoose.model('Item', itemSchema);
exports.Request = mongoose.model('Request', requestSchema);