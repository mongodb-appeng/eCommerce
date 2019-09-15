import config from '../../src/config'

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
// TODO remove password
const url = `mongodb+srv://${config.dbUser}:${dbPassword}@ecommerce-nwagk.mongodb.net/test?retryWrites=true&w=majority`;
const dbName = config.database;

// Create a new MongoClient
const client = new MongoClient(url);

let categoryTree = {
  name: 'categoryTree',
  children: []
};

let saleCategoryTree = {
  name: 'saleCategoryTree',
  children: []
};

function pushNode(branch, path) {
  branch.count++;
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
          children: [],
          count: 0
        }
        pushNode(newNode, path.slice(1, path.length));
        branch.children.push(newNode);
      }
    };
  };
}

function sorted(branch) {
    if (branch.children.length >= 0) {
      branch.children.sort((a,b) => b.count - a.count);
      branch.children.forEach((child) => sorted(child));
    }
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
      sort: {categoryHierarchy: 1}
      // limit: 50
    }
  ).toArray()
    .then((prodArray) => {
      prodArray.forEach((doc) => {
        pushNode(categoryTree, doc.categoryHierarchy);
      });
    })
    .then(() => {
      sorted(categoryTree);
      console.log('Done');
      console.log(categoryTree);
      const db = client.db(dbName);
      if (categoryTree.children) {
        categoryTree.children[0].name = "All categories"
      }
      db.collection('meta').replaceOne({ name: 'categoryTree' }, categoryTree, { upsert: true });
    });

    prodArray = db.collection('products').find(
      {categoryHierarchy: 'sale'},
      {
        projection: { _id: 0, categoryHierarchy: 1 }
      }
    ).toArray()
      .then((prodArray) => {
        prodArray.forEach((doc) => {
          pushNode(saleCategoryTree, doc.categoryHierarchy);
        });
      })
      .then(() => {
        sorted(saleCategoryTree);
        console.log('Done');
        console.log(saleCategoryTree);
        const db = client.db(dbName);
        if (saleCategoryTree.children) {
          saleCategoryTree.children[0].name = "Sale items"
        }
        db.collection('meta').replaceOne({ name: 'saleCategoryTree' }, saleCategoryTree, { upsert: true });
      });

  // client.close();
});
