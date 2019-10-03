exports = function(event) {
    const db = context.services.get("mongodb-atlas").db("ecommerce");
    const customers = db.collection("customers");
    const product = event.fullDocument;
    const notifyCustomer = (customer) => {
        return context.functions.execute(
            "emailStockNotification",
            customer.contact.email,
            product.productName,
            product.productID,
            customer.marketingPreference.email
        )
        .then(() => {
            return context.functions.execute(
                "textStockNotification",
                customer.contact.phone,
                product.productName,
                product.productID,
                customer.marketingPreference.text
            )
        })
        .then(() => {
            let index = this.customer.waitingOnProducts.indexOf(this.productID);
            customer.waitingOnProducts.splice(index, 1);
            return customers.updateOne(
                {'contact.email': customer.contact.email},
                {$set: {waitingOnProducts: customer.waitingOnProducts}}
            )
        })
        .catch((error) => {
            console.log(error);
        })
    };
    return customers.find({waitingOnProducts: product.productID}).toArray.then((customers) => {
        return Promise.all(customers.map((customer) => {
            return notifyCustomer(customer);
        }))
    })
}

{"updateDescription.updatedFields":{"stockLevel":{"$gt":{"$numberInt":"0"}}}}
{"updateDescription.updatedFields.":{"$gt":{"$numberInt":"0"}}}
