<template>
<!-- Vue.js component to display a set of products. The user can filter the products
by selecting a product category or providing a search term. The rendering of
each product "card" is delegated to the `ProductCard` component. -->
    <div>
      <section class="section" id="product-cards">
        <ul id="product-list">
          <li
            v-for="product in products"
            v-bind:key="product.productId">
              <a v-on:click="jumpToProduct(product.productID)">
                <ProductCard
                  v-bind:product="product">
                </ProductCard>
              </a>
          </li>
        </ul>
      </section>
      <br>
      <Status v-bind:status="status"></Status>
    </div>
</template>

<script>
import Status from '../Status.vue'
import ProductCard from "./ProductCard.vue"
import { mapState } from 'vuex';

export default {
    name: "ProductCards",
    props: [
      'searchTerm'
    ], 
    components: {
        ProductCard,
        Status
    },
    data() {
        return {
          status: null,
          products: [],
          bouncable: false,
          lastProductID: '',
          lastInterest: 10000,
          lastScore: 10000,
          localSearchTerm: ''
        }
    },
    computed: {
      ...mapState([
          'categoryFilter'
      ]),
    },
    watch: {
      /**
       * When the user selects a different product category (hierarchy), this
       * component needs to fetch the revised list of products
       */
      categoryFilter: function () {  
        this.lastProductID = '';
        this.lastInterest = 10000;
        this.products = [];
        this.fetchProductList();
        this.localSearchTerm = '';
      },

      /**
       * When the user runs a different product search, this
       * component needs to fetch the revised list of products
       */
      searchTerm: function (term) {
        this.localSearchTerm = term;
        this.lastProductID = '';
        this.lastInterest = 10000;
        this.lastScore = 10000;
        this.products = [];
        this.searchProducts();
      }
    },
    methods: {

      /**
       * Browser is redirected to a 'page' that displays all of the information
       * specific to this product
       * @param {string} productID - Uniquely identifies the product
       */
      jumpToProduct(productID) {
        window.onscroll = () => {};
        this.$router.push(
          {
            name: 'product',
            query: {productID: productID}
          }
          );
      },

      /**
       * Fetches the 20 most relevent products from the `products` collection. If 
       * this is a follow-on call to fetch a further 20 products then it will start
       * from where the previous call left off (so that the same product isn't)
       * included multiple times. Optionally filters by category (hierarchy).
       */
      fetchProductList () {
        this.status = {state: 'progress', text: 'Fetching product list'};
        this.bouncable = false; // Used to avoid multiple, near-simultaneous database reads
        
        // Avoid reading the same product documents again
        let query = {
          $or: [
            {
              interest: {$lt: this.lastInterest}
            },
            {
              $and: [
                {
                  interest: {$eq: this.lastInterest}
                },
                {
                  productID: {$gt: this.lastProductID}
                }
              ]
            }
          ]
        };
        if (this.categoryFilter.length > 0) {
          let matchCategories = [];
          for (let i = 0; i < this.categoryFilter.length; i++) {
            let fieldName = `categoryHierarchy.${i+1}`;
            let clause = {};
            clause[fieldName] = this.categoryFilter[i];
            matchCategories.push(clause);
          }
          query.$and = [
            {$and: matchCategories}
          ];
        }
        this.$root.$data.database.collection("products")
        .find(
          query,
          {
            projection: {
              _id: 0,
              productID: 1,
              productName: 1,
              description: 1,
              category: 1,
              productImages: 1,
              price: 1,
              interest: 1,
              "reviews.averageReviewScore": 1,
              "reviews.numberOfReviews": 1
            },
            sort: {interest: -1, productID: 1},
            limit: 20
          }
        ).toArray()
        .then ((docArray) => {
          if (docArray.length > 0) {
            this.lastProductID = docArray[docArray.length - 1].productID;
            this.lastInterest = docArray[docArray.length - 1].interest;
            
            docArray.forEach((item) => {
              this.products.push(item);
            });
            this.status = null;
            const _this = this;
            // Wait half a second before allowing a request to fetch more products
            setTimeout(function(){        
                _this.bouncable = true;
              }, 500);
          } else {
            this.status = {state: 'success', text: 'No more matching products.'};
          }
        },
        (error) => {
          this.status = {state: 'error', text: `Error: Failed to read the list of products – ${error}`};
        })
      },

      /**
       * searches for the 20 most relevent products from the `products` collection.
       * this is a follow-on call to fetch a further 20 products then it will start
       * from where the previous call left off (so that the same product isn't)
       * included multiple times. Uses MongoDB Atlas full text search:
       * https://docs.atlas.mongodb.com/full-text-search/
       */
      searchProducts () {
        this.status = {state: 'progress', text: 'Searching for matching products'};
        this.bouncable = false;
        // TODO move this to a system-user Stitch function so that the `product.internal`
        // attribute can be hidden by a rule
        this.$root.$data.database.collection('products').aggregate(
          [
            {
              $searchBeta: {
                index: 'Titles and descriptions', 
                compound: {
                  must: {
                    search: {
                      query: this.localSearchTerm, 
                      path: 'description'
                    }
                  }, 
                  should: {
                    search: {
                      query: this.localSearchTerm, 
                      path: 'productName'
                    },
                    // eslint-disable-next-line
                    search: {
                      query: this.localSearchTerm, 
                      path: 'category'
                    }
                  }
                }, 
                highlight: {
                  path: 'description'
                }
              }
            }, {
              $project: {
                _id: 0,
                productName: 1, 
                description: 1, 
                productID: 1, 
                category: 1, 
                productImages: 1, 
                price: 1,
                "reviews.averageReviewScore": 1,
                "reviews.numberOfReviews": 1,
                score: {
                  $meta: 'searchScore'
                }, 
                highlights: {
                  $meta: 'searchHighlights'
                }
              }
            },
            {
              $match: {
                $or: [
                  {
                    score: {$lt: this.lastScore}
                  },
                  {
                    $and: [
                      {
                        score: {$eq: this.lastScore},
                      },
                      {
                        productID: {$lt: this.lastProductID}
                      }
                    ]
                  }
                ]
              }
            },
            {
              '$sort': {
                'score': -1, 
                'productID': -1
              }
            }, 
            {
              '$limit': 20
            }
          ]
        ).toArray()
        .then ((docArray) => {
          if (docArray.length > 0) {
            this.lastProductID = docArray[docArray.length - 1].productID;
            this.lastScore = docArray[docArray.length - 1].score;
            docArray.forEach((item) => {
              this.products.push(item);
            })
            this.status = null;
            const _this = this;
            // Wait half a second before allowing a request to fetch more products
            setTimeout(function(){        
                _this.bouncable = true;
              }, 500);
          } else {
            this.status = {state: 'success', text: 'No more matching products', time: 2000};
          }
        },
        (error) => {
          this.status = {state: 'error', text: `Error: Failed to read the list of products – ${error}`};
        })
      },

      /**
       * When the user scrolls to the bottom of the page, fetch the next set of products
       */
      scroll () {
        window.onscroll = () => {
          const position = 750 + Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop) + window.innerHeight;
          const height = document.documentElement.offsetHeight;
          if (position >= height) {
            if (this.bouncable) {
              if (this.localSearchTerm === '') {
                this.fetchProductList();
              } else {
                this.searchProducts();
              }
            }
          }
        }
      }
    },
    created() {
      this.localSearchTerm = this.searchTerm;
    },
    mounted() {
      this.fetchProductList();
      this.scroll();
  }
}
</script>

<style scoped>

  #product-cards {
    max-height: 10%;
    display: flex;
    overflow-y: auto;
    flex-direction: column;
  }

</style>