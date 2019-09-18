var config = require('../../src/config.js');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = `mongodb+srv://${config.dbUser}:${config.dbPassword}@ecommerce-nwagk.mongodb.net/test?retryWrites=true&w=1`;
const dbName = config.database;

// Create a new MongoClient
const client = new MongoClient(url);

var docsUpdated = 0;

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  function cleanDoc(doc) {
    doc.price.list = (Math.round(doc.price.list * 100)) / 100;
    doc.price.sale = (Math.round(doc.price.sale * 100)) / 100;
    db.collection('products').replaceOne({_id: doc._id}, doc);
    docsUpdated++; 
  }

  const db = client.db(dbName);
  let prodArray = db.collection('products').find(
    {}, 
    {
      sort: {interest: -1, productID: 1}
    }
  ).toArray()
    .then((prodArray) => {
      prodArray.forEach((doc) => {
        cleanDoc(doc);
      });
    })
    .then(() => {
      console.log (`Cleaned ${docsUpdated} docs`);
    });
  // client.close();
});
