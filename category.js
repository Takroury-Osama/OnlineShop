const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const objectId = mongoose.Schema.Types.ObjectID


let category = new Schema({
  _id: String,
  CategoryName: String
});


module.exports = mongoose.model('Category', category);
