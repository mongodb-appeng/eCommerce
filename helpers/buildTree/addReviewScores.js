var config = require('../../src/config.js');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = `mongodb+srv://${config.dbUser}:${config.dbPassword}@ecommerce-nwagk.mongodb.net/test?retryWrites=true&w=1`;
const dbName = config.database;

const client = new MongoClient(url);
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  function cleanDoc(doc) {
    let changed = false;
    if (doc.reviews && doc.reviews.recentReviews && doc.reviews.recentReviews.length > 0) {
      doc.reviews.recentReviews.forEach((review, index) => {
        if (! review.score) {
          changed = true;
          doc.reviews.recentReviews[index] = {
            review: review,
            score: Math.ceil(Math.random() * 5)
          }
        }
      })
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
