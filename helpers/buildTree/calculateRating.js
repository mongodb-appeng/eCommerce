var config = require('../../src/config.js');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = `mongodb+srv://${config.dbUser}:${config.dbPassword}@ecommerce-nwagk.mongodb.net/test?retryWrites=true&w=1`;
const dbName = config.database;
var docsUpdated = 0;

// Create a new MongoClient
const client = new MongoClient(url);


// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  function cleanDoc(doc) {
    let changed = false;
    if (doc.reviews.recentReviews.length == 0) {
      if (doc.reviews.averageReviewScore != 0 || doc.reviews.numberOfReviews != 0 || doc.reviews.totalReviewScore != 0) {
        doc.reviews.averageReviewScore = 0;
        doc.reviews.numberOfReviews = 0;
        doc.reviews.totalReviewScore = 0;
        changed = true;
      }
    } else {
      doc.reviews.numberOfReviews = doc.reviews.recentReviews.length;
      doc.reviews.totalReviewScore = 0;
      doc.reviews.recentReviews.forEach((review) => {
        doc.reviews.totalReviewScore += review.score;
      })
      doc.reviews.averageReviewScore = doc.reviews.totalReviewScore / doc.reviews.numberOfReviews;
      changed = true;
    }
    if (changed) {
      docsUpdated ++;
      db.collection('products').replaceOne({_id: doc._id}, doc);
    }
  }

  const db = client.db(dbName);
  let prodArray = db.collection('products').find(
    {}
    // { limit: 100}
  ).toArray()
    .then((prodArray) => {
      prodArray.forEach((doc) => {
        cleanDoc(doc);
      });
    })
    .then(() => {
      console.log (`Updated ${docsUpdated} docs`);
    });
  // client.close();
});
