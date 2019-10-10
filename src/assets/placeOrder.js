exports = function(paymentMethod) {
    // TODO remove
    const context = {};
    const customerCollection = context.services.get("mongodb-atlas").db("ecommerce").collection("customers");
    const orderCollection = context.services.get("mongodb-atlas").db("ecommerce").collection("orderOverflow");
    let orderToArchive = null;
    let thisOrderItems = null;

    const updateStockLevel = (lineItem) => {
        console.log(`Updating stock level for: ${lineItem.productID}`);
        return context.functions.execute(
            "emailStockNotification",
            customer.contact.email,
            product.productName,
            product.productID,
            customer.marketingPreferences.email
        )
        .then(() => {
            return context.functions.execute(
                "textStockNotification",
                customer.contact.phone,
                product.productName,
                product.productID,
                customer.marketingPreferences.sms
            );
        })
        .then(() => {
            console.log('Time to splice');
            let waitingOnProducts = [...customer.waitingOnProducts];
            let index = waitingOnProducts.indexOf(product.productID);
            console.log(`Slicing, index: ${index}`);
            console.log(`Current length: ${waitingOnProducts.length}`);
            waitingOnProducts.splice(index, 1);
            console.log(`Post-splice length: ${waitingOnProducts.length}`);
            return customers.updateOne(
                {'contact.email': customer.contact.email},
                {$set: {waitingOnProducts: waitingOnProducts}}
            );
        })
        .catch((error) => {
            console.log(error);
        });
    };

    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
    console.log('Fetching customer document');
    return customerCollection.findOne({owner_id: context.user.id})
    .then ((customer) => {
        console.log('Found customer document');
        const totalPrice = customer.shoppingBasket.reduce((total, item) =>
        {
          return total + (item.quantity * item.price);
        }, 0);
        console.log(`totalPrice: ${totalPrice}`);
        console.log(`${customer.shoppingBasket.length} products in the shoppingBasket`);
        
        let newOrder = {
            orderID: `${customer.contact.email}-${Date.now()}`,
            status: 'pending',
            orderDate: new Date(),
            deliveryDate: null,
            deliveryAddress: customer.contact.deliveryAddress,
            totalPrice: totalPrice,
            paymentMethod: paymentMethod,
            items: customer.shoppingBasket
        };
        thisOrderItems = customer.shoppingBasket;
        customer.orders = [newOrder].concat(customer.orders);
        console.log(`number of orders: ${customer.orders.length}`);
        if (customer.orders.length > 10) {
            console.log('Need to archive older order');
            orderToArchive = customer.orders.pop();
            orderToArchive.customerEmail = customer.contact.email;
            orderToArchive.owner_id = context.user.id;
        }
        return customerCollection.updateOne(
            {owner_id: context.user.id},
            {$set: {
              orders: customer.orders,
              orderOverflow: true
            }}
        );
    })
    .then (() => {
      console.log('Updated customer document');
        if (orderToArchive) {
            return orderCollection.insertOne(orderToArchive);
        } else {
            return {result: true};
        }
    })
    .then (() => {
      // TODO
      // Update stock levels for every product in the order
        return Promise.all(thisOrderItems((item) => {
          return updateStockLevel(item);
        }));
    })
    .then(() => {
      console.log('Returning true');
      return {result: true};
    },
    (error) => {
        const errorSring = `Failed to store the new order: ${error.message}`;
        console.error(errorSring);
        return {result: false, error: errorSring};
    });
 };
 
