exports = function(lineItem){
    // This is implemented as a seperate, private Stitch Function so that it can run as
    // System to update the product documents.
    const productsCollection = context.services.get("mongodb-atlas").db("ecommerce").collection("products");
   
    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    console.log(`Updated stock level for ${lineItem.productName}`);
    return productsCollection.findOne({productID: lineItem.productID})
    .then ((productDoc) => {
        const newStockLevel = Math.min (0, productDoc.stockLevel - productDoc.quantity);
        return productsCollection.updateOne(
            {productID: lineItem.productID},
            {$set: {stockLevel: newStockLevel}}
        );
    },
    (error) => {
        const errorSring = `Failed to update existing product document: ${error.message}`;
        console.error(errorSring);
    })
};