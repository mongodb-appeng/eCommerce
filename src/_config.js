const config = {
    appName: 'mongodb-ecommerce',
    appId: 'ecommerce-xxxxx',
    database: 'ecommerce',
    aws: {
        serviceName: 'AWS2',
        bucket: 'ecommerce-mongodb-mugshots',
        productBucket: 'ecommerce-mongodb-products'
    },
    stripePublicKey: 'pk_test_xxxxxxxxxx',
    logErrors: false
}

module.exports = config;
