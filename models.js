var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var pantrySchema = new Schema({
  name: {type: String, required: true, unique: true},
  items: [Schema.Types.ObjectId],
  requests: [Schema.Types.ObjectId]
})

exports.Pantry = mongoose.model('Pantry', pantrySchema);