exports = function(paymentMethod) {
    const customerCollection = context.services.get("mongodb-atlas").db("ecommerce").collection("customers");
    const orderCollection = context.services.get("mongodb-atlas").db("ecommerce").collection("orderOverflow");
    let orderToArchive = null;
    return customerCollection.findOne({owner_id: context.user.id})
    .then ((customer) => {
        const totalPrice = customer.shoppingBasket.reduce((total, item) =>
        {
          return total + (item.quantity * item.price);
        }, 0);
        let newOrder = {
            orderID: `${customer.contact.email}-${Date.now()}`,
            status: 'pending',
            orderDate: new Date(),
            deliveryDate: null,
            deliveryAddress: customer.contact.deliveryAddress,
            totalPrice: totalPrice,
            paymentMethod: paymentMethod,
            items: customer.items
        };
        customer.orders = [newOrder].concat(customer.orders);
        if (customer.orders.length > 10) {
            orderToArchive = customer.orders.pop();
            orderToArchive.customerEmail = customer.contact.email;
            customer.orders.overflow = true;
        }
        return customerCollection.updateOne(
            {'customer.contact.email': customer.contact.email},
            {$set: {orders: customer.orders}}
        );
    })
    .then (() => {
        if (orderToArchive) {
            return orderCollection.insertOne(orderToArchive);
        } else {
            return;
        }
    },
    (error) => {
        console.error(`Failed to store the new order: ${error.message}`);
    });
 };