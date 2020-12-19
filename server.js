const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false,useNewUrlParser:true }))
// parse application/json
app.use(bodyParser.json())
const db = mongoose.connect('mongodb://localhost/OnlineShops', {useNewUrlParser: true, useUnifiedTopology: true});

const Category = require('./model/category');
const Tshirt = require('./model/tshirt');
const Order = require('./model/order');



app.post('/addcategory', function(req, res) {
    let newCategory = new Category();

    newCategory._id = req.body._id;
    newCategory.CategoryName = req.body.CategoryName;

    newCategory.save(function(err, savedCategory) {
      if(err) {
        res.status(500).send({error:"failed to add new category"})
        console.log(err);
      }
      else {
        res.send(savedCategory)
        console.log("category added successfully");
      }
    })
  })

app.get('/categories', function(req, res) {
  Category.find({}, function(err, Categorys) {
    if(err) {
      res.status(500).send({error:"failed to get categories"})
      console.log(err);
    }
    else {
      res.send(Categorys)
    }
  })
})

app.post('/addTshirt', function(req, res) {
  let newTshirt = new Tshirt();

  newTshirt._id = req.body._id;
  newTshirt.TshirtName = req.body.TshirtName;
  newTshirt.TshirtPrice = req.body.TshirtPrice;
  newTshirt.NumberOfAvailabeItems = req.body.NumberOfAvailabeItems;

  newTshirt.save(function(err, savedTshirt) {
    if(err) {
      res.status(500).send({error:"failed to add new Tshirt"})
      console.log(err);
    }
    else {
      res.send(savedTshirt)
      console.log("Tshirt added successfully");
    }
  })
})

app.put('/category/Tshirt/add', function(req, res) {
    let categoryID = req.body.categoryId;
    let tshirtID = req.body.TshirtId;

    Category.findOne({_id: categoryID}, function(err, category) {
      if(err) {
        res.status(500).send({error:"no category with this Id"})
        console.log(err);
      }
      else {
        Tshirt.updateOne({_id: tshirtID}, {$addToSet: {TshirtCategoryID: category._id}}, function(err, updated) {
          if(err) {
            res.status(500).send({error:"failed to update Tshirt"})
            console.log(err);
          }
          else {
            res.send(updated)
          }
        })
      }
    })
  })

app.get('/Tshirts', function(req, res) {
    Tshirt.find({}).populate({

    path: 'TshirtCategoryID',
    model: 'Category',
    select: 'CategoryName -_id=0'

  }).exec(function(err, tshirts) {
    if(err) {
      res.status(500).send({Error:"could not get tshirts"})
    }
    else {
      res.send(tshirts)
    }
  })
})

app.post('/order', function(req, res) {
  let newOrder = new Order();

  newOrder.OrderNumber = req.body.OrderNumber;
  newOrder.CustomerPhoneNumber = req.body.CustomerPhoneNumber;
  newOrder.TshirtID = req.body.TshirtID;

  newOrder.save(function(err, savedOrder) {
    if(err) {
      res.status(500).send({error:"failed to add new order"})
      console.log(err);
    }
    else {
      res.send(savedOrder)
      console.log("order added successfully");
    }
  })
})

app.put('/order/Tshirt/add', function(req, res, next) {
    let orderID = req.body.OrderId;
    let tshirtID = req.body.TshirtId;


    Order.findOne({_id: orderID}, function(err, order) {
      if(err) {
        res.status(500).send({error:"no order with this Id"})
        console.log(err);
      }
      else {
        Tshirt.findOne({_id: tshirtID}, function(err, category) {
          if(err) {
              res.status(500).send({error:"wrong Tshirt with this Id"})
              console.log(err);
            }
          else {
            next()
            }
          })
        }
      })
},function (req, res) {

    let tshirtID = req.body.TshirtId;
    console.log(tshirtID);
    Tshirt.updateOne({_id:tshirtID},{ $inc: { 'NumberOfAvailabeItems' : -1 }}, function(err, updated) {
    if(err) {
      res.status(500).send({error:"failed to update Tshirt"})
      console.log(err);
    }
    else {
      res.send(updated)
    }
  })
  }
)

app.get('/orders', function(req, res) {
  Order.find({}).populate({
    //populate take array
    path: 'TshirtID',     //array want to added
    model: 'Tshirt',
    select: '_id -NumberOfAvailabeItems=1'

  }).exec(function(err, orders) {
    if(err) {
      res.status(500).send({Error:"could not get orders"})
      console.log(err);
    }
    else {
      res.send(orders)
    }
  })
})

                  //____________________________________________

app.listen(3000, function(){
  console.log('server connected..');
});
