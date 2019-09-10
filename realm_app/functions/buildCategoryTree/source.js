exports = function(arg){
  const db = context.services.get("mongodb-atlas").db("eCommerce");
  const products = db.collection("products");
  var categories = ['nobby'];
  // const meta = db.collection("meta");
  console.log(`Fetching product categories`);
  try {
     products.find(
       {},
       {category: 1}
      ).toArray()
     .then ((docArray) => {
       // categories.push(docArray[3].category);
       console.log(`${docArray.length} elements`);
       docArray.forEach((item) => {
        categories.push(item.category);
       },
       (error) => {
         console.error(`Processing product failed: ${error.message}`); 
       });
     },
     (error) => {
      console.error(`Find failed: ${error.message}`);        
        });
      }
  catch (error) {
    console.error (`Failed building category tree: ${error.message}`);
  }
};

/*
  const db = context.services.get("mongodb-atlas").db("eCommerce");
  const products = db.collection("products");
  const meta = db.collection("meta");
  var categories = ['numpty'];

  return products.find().toArray()
  .then ((docArray) => {
    docArray.forEach((item) => {
      
     categories.push(item.category);
     console.error('fish');
    });
  },
    (error) => {
      console.error(`Failed to process product document: ${error.message}`);
    })
  .then (() => {
    console.log(`categores: ${categories}`);
  });

  const db = context.services.get("mongodb-atlas").db("eCommerce");
  const products = db.collection("products");
  const meta = db.collection("meta");
  var categories = ['numpty'];
  categories.push('one');
  console.log('starting');
  return products.find().toArray()
  .then((products) => {
    return Promise.all(products.map((product) => {
      categories.push(product.category);
      categories.push('more');
      console.log(`category: ${product.category}`);
    },
    (error) => {
      console.error(`Failed to process product document: ${error.message}`);
    });
  },
  (error) => {
    console.error(`Failed to read product documents: ${error.message}`);
  })
  .then(() => {
    console.log(`categores: ${categories}`);
  });
  */
