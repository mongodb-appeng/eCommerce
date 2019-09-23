var config = require('../../src/config.js');
const axios = require('axios');
var AWS = require('aws-sdk');
var argv = require('minimist')(process.argv.slice(2));

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = `mongodb+srv://${config.dbUser}:${config.dbPassword}@ecommerce-nwagk.mongodb.net/test?retryWrites=true&w=1`;
const dbName = config.database;

// Create a new MongoClient
const client = new MongoClient(url);
var db;

var docsUpdated = 0;
var imagesRemoved = 0;
var imagesCopied = 0;

AWS.config.update({
  accessKeyId: config.aws.accessKeyId, 
  secretAccessKey: config.aws.secretAccessKey
});
var s3 = new AWS.S3();

function uploadProductImages(doc) {
  let imageArray = [];
  // console.log(`array length = ${doc.productImages.length}`);
  var copyImages = doc.productImages.map((imageURL, imageIndex) => {
    return axios.get(imageURL, {responseType: 'arraybuffer'})
    .then((response) => {
      imagesCopied ++;
      const buffer = Buffer.from(response.data, 'base64');
      return s3.putObject({
        Bucket: config.aws.productBucket,
        Key: `${doc.productID}-${imageIndex}.jpg`,
        Body: buffer,
        ContentType: 'img/jpg',
        ACL: 'public-read'
      }).promise().then (() => {
        const newURL = `https://${config.aws.productBucket}.s3.amazonaws.com/${doc.productID}-${imageIndex}.jpg`;
        // console.log(`Wrote to S3; URL = ${newURL}`);
        imageArray.push(newURL);
      })
    }, () => {
      // console.log(`Requested URL: ${imageURL}`);
      // console.log(`Error: ${error.message}`);
      // Just discard the broken link silently
      imagesRemoved++;
    })
  });

  return Promise.all(copyImages).then (() => {
    imageArray.sort();
    return db.collection('products').updateOne({_id: doc._id}, 
      {$set: {productImages: imageArray}}).then (() => {
        docsUpdated++;
        // console.log(`docsUpdated: ${docsUpdated}`);
      },
      (error) => {
        console.error(`Error updating database: ${error}`);
      })
  });
}

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
  console.log("Connected successfully to server");
  db = client.db(dbName);
  db.collection('products').find(
    {
      productImages: {$regex:/s7d9/}
      // productName: 'GE ENERGY STAR Dishwasher with Stainless Steel Interior and Hidden Controls'
    }, 
    {
      sort: {_id: 1},
      skip: argv.s,
      limit: argv.l,
      project: {
        productID: 1,
        productImages: 1
      }
    }
  ).toArray()
  .then((prodArray) => {
    return prodArray.forEach((doc) => {
      uploadProductImages(doc)
      .then (() => {
        console.log (`Pass: Updated ${docsUpdated} docs; removed ${imagesRemoved} dead links; copied ${imagesCopied} images to S3.`);
      })
    })
  })
  .then(() => {
    // uploadProductImages invoked on each array element
    console.log('Done');
  });
  // client.close();
});
