db.products.aggregate(
        [
            {
              "$searchBeta": {
                "index": "Titles and descriptions",
                "compound": {
                  "must": {
                    "search": {
                      "query": "batman",
                      "path": "description"
                    }
                  },
                  "should": {
                    "search": {
                      "query": "batman",
                      "path": "category"
                    }
                  }
                },
                "highlight": {
                  "path": "description"
                }
              }
            },
            {
              "$project": {
                "_id": 0,
                "productName": 1,
                "description": 1,
                "productID": 1,
                "category": 1,
                "productImages": 1,
                "price": 1,
                "reviews.averageReviewScore": 1,
                "reviews.numberOfReviews": 1,
                "score": {
                  "$meta": "searchScore"
                },
                "highlights": {
                  "$meta": "searchHighlights"
                }
              }
            },
            {
              "$match": {
                "$or": [
                  {
                    "score": {
                      "$lt": 10000
                    }
                  },
                  {
                    "$and": [
                      {
                        "score": {
                          "$eq": 10000
                        }
                      },
                      {
                        "productID": {
                          "$lt": ""
                        }
                      }
                    ]
                  }
                ]
              }
            },
            {
              "$sort": {
                "score": -1,
                "productID": -1
              }
            },
            {
              "$limit": 20
            }
      ]
)