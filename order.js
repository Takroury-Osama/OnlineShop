const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const objectId = mongoose.Schema.Types.ObjectID
const objectDate = mongoose.Schema.Types.Date


let order = new Schema({
  OrderNumber: Number,
  TshirtID: { type: String , ref: 'Tshirt' },
  OrderDateTime: {type: objectDate, default: Date, timezone: 'Asia/Calcutta'},
  CustomerPhoneNumber: Number
})


module.exports = mongoose.model('Order', order)
