db.products.aggregate(
    [
        {$addFields: {
            interest: {
                $add: [
                    {$size: '$reviews.recentReviews'},
                    {$multiply: [
                        2,
                        {$size: '$productImages'}
                    ]},
                    {$multiply: [
                        2,
                        {$size: '$categoryHierarchy'}
                    ]},
                ]
            }
        }},
        {$out: 'products2'}
    ]
)

db.products.updateMany(
    {
        $set: {
            interest: {
                $add: [
                    {$size: '$reviews.recentReviews'},
                    {$multiply: [
                        2,
                        {$size: '$productImages'}
                    ]},
                    {$multiply: [
                        2,
                        {$size: '$categoryHierarchy'}
                    ]},
                ]
            }
        }
    }
)

db.products.updateMany(
    {productID: '002accd6fafae977acc923604567454b'},
    {
        $set: {
            "price.list": {
                $round: ["$price.list", 2]
            }
        }
    }
)

db.products.aggregate([
    {
        $addFields: {
            'price.list': {$round: ['$price.list', 2]}
        }
    },
    {
        $addFields: {
            'price.sale': {$round: ['$price.sale', 2]}
        }
    },
    {
        $merge: {
            into: 'products2',
            on: 'productID',
            whenMatched: 'replace'
        }
    }
])

db.products2.aggregate([
    {
        $merge: {
            into: 'products',
            on: 'productID',
            whenMatched: 'replace'
        }
    }
])