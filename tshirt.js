const mongoose = require('mongoose');
//const objectId = mongoose.Schema.Types.ObjectID

const Schema = mongoose.Schema;

let tshirt = new Schema({
  _id: String,
  TshirtName: String,
  TshirtCategoryID: [{type: String, ref: 'Category'}],
  TshirtPrice: Number,
  NumberOfAvailabeItems: {type: Number}
})


module.exports = mongoose.model('Tshirt', tshirt);
