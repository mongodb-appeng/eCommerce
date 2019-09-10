const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb+srv://billy:password@ecommerce-nwagk.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'ecommerce';

// Create a new MongoClient
const client = new MongoClient(url);

let categoryTree = {
  name: 'categoryTree',
  children: []
};

function pushNode(branch, path) {
  if (path.length > 0) {
    if (branch.children.length >= 0) {
      let index = branch.children.findIndex(node => node.name === path[0]);
      if (index > -1) {
        // A node at  this level already exists
        pushNode(
          branch.children[index],
          path.slice(1, path.length)
        );
      } else {
        // Need to push a new node
        let newNode = {
          name: path[0],
          children: []
        }
        pushNode(newNode, path.slice(1, path.length));
        branch.children.push(newNode);
      }
    };
  };
}

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  let prodArray = db.collection('products').find(
    {},
    {
      projection: { _id: 0, categoryHierarchy: 1 },
      limit: 50
    }
  ).toArray()
    .then((prodArray) => {
      prodArray.forEach((doc) => {
        pushNode(categoryTree, doc.categoryHierarchy);
      });
    })
    .then(() => {
      console.log('Done');
      console.log(categoryTree);
      // TODO: Store in the database
      const db = client.db(dbName);
      db.collection('meta').replaceOne({ name: 'categoryTree' }, categoryTree, { upsert: true });
    });

  // client.close();
});
