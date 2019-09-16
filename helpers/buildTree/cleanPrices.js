var config = require('../../src/config.js');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = `mongodb+srv://${config.dbUser}:${config.dbPassword}@ecommerce-nwagk.mongodb.net/test?retryWrites=true&w=1`;
const dbName = config.database;

// Create a new MongoClient
const client = new MongoClient(url);


// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  function cleanDoc(doc) {
    let changed = false;
    if (doc.price.sale == '') {
      changed = true;
      doc.price.sale = 10;
    }
    if (isNaN(doc.price.sale)) {
      changed = true;
      try {doc.price.sale = parseFloat(doc.price.sale)}
      catch {doc.price.sale = 42}
    }
    if (!doc.price.list || isNaN(doc.price.list)) {
      changed = true;
      doc.price.list = doc.price.sale * 1.11;
    }
    if (changed) {
      db.collection('products').replaceOne({_id: doc._id}, doc);
    }
  }

  const db = client.db(dbName);
  let prodArray = db.collection('products').find(
    {}
  ).toArray()
    .then((prodArray) => {
      prodArray.forEach((doc) => {
        cleanDoc(doc);
      });
    })
    .then(() => {
      console.log ('Done');
    });
  // client.close();
});
