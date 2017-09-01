var mongoose = require('mongoose');


var autherSchema = mongoose.Schema({
  name    : String,
  stories : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }]
});

var Author = module.exports = mongoose.model('Author', autherSchema);