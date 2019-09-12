db.products.count({productID: {$gt: "9793f3f9618de580ac31ff1a208a9656"}, $and: [{categoryHierarchy: {$all: ["socks"]}}, {categoryHierarchy: {$size: 1}}]})

db.products.count({
    categoryHierarchy: "socks"
})

db.products.count({
    "productID": {
        $gt: ""
    },
    $and: [
        {
            "categoryHierarchy": {
                $all: [
                    "for-the-home"
                ]
            }
        },
        {$and: [
            {"categoryHierarchy.1": "for-the-home"},
            {"categoryHierarchy": {$size: 3}}
        ]}
    ]
})