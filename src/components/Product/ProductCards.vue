<template>
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
      <!-- TODO: Move these to a status component -->
      <div v-if="error" class="notification is-danger">
          <strong>{{ error }}</strong>
      </div>
      <div v-if="success" class="notification is-success">
          {{ success }}
      </div>
      <div v-if="progress" class="notification is-primary">
          {{ progress }}
      </div>
    </div>
</template>

<script>
import ProductCard from "./ProductCard.vue"
import { 
    mapState
    // mapMutations 
    } from 'vuex';

export default {
    name: "ProductCards",
    props: [
      'searchTerm'
    ], 
    components: {
        ProductCard,
    },
    data() {
        return {
          error: '',
          progress: '',
          success: '',
          products: [],
          bouncable: false,
          lastProductID: 'fffffffffffffffffffffffffffffff',
          lastScore: 10000
        }
    },
    computed: {
      ...mapState([
          'database',
          'categoryFilter'
      ]),
    },
    watch: {
      categoryFilter: function () {  
        this.lastProductID = 'fffffffffffffffffffffffffffffff';
        this.products = [];
        this.fetchProductList();
        this.searchTerm = '';
      },
      searchTerm: function () {
        this.lastProductID = 'fffffffffffffffffffffffffffffff';
        this.lastScore = 10000;
        this.products = [];
        this.searchProducts();
      }
    },
    methods: {
      // ...mapMutations([
      //   ]),
      jumpToProduct(productID) {
        window.onscroll = () => {};
        this.$router.push(
          {
            name: 'product',
            query: {productID: productID}
          }
          );
      },
      fetchProductList () {
        this.error = '';
        this.success = '';
        this.progress = "Fetching product list";
        this.bouncable = false;
        let query = {
          productID: {$lt: this.lastProductID}
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
        this.database.collection("products")
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
              "reviews.averageReviewScore": 1,
              "reviews.numberOfReviews": 1
            },
            // TODO should probably find something better to sort on (like) review scores
            // but need to figure out how to not break the efficient pagination
            sort: {productID: -1},
            limit: 20
          }
        ).toArray()
        .then ((docArray) => {
          if (docArray.length > 0) {
            this.lastProductID = docArray[docArray.length - 1].productID;
            docArray.forEach((item) => {
              this.products.push(item);
            })
            this.progress = '';
            const _this = this;
            // Wait 2 seconds before allowing a request to fetch more products
            setTimeout(function(){        
                _this.bouncable = true;
              }, 500);
            } else {
              this.progress = '';
              this.success = 'No more matching products.';
            }
        },
        (error) => {
          this.progress = '';
          this.error = `Error: Failed to read the list of products – ${error.message}`;
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
            console.error(this.error);
        })
      },

      searchProducts () {
        this.error = '';
        this.success = '';
        this.progress = "Searching for matching products";
        this.bouncable = false;
        this.database.collection('products').aggregate(
          [
            {
              $searchBeta: {
                index: 'Titles and descriptions', 
                compound: {
                  must: {
                    search: {
                      query: this.searchTerm, 
                      path: 'description'
                    }
                  }, 
                  should: {
                    search: {
                      query: 'shirt', 
                      path: 'productName'
                    },
                    // eslint-disable-next-line
                    search: {
                      query: 'shirt', 
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
            this.progress = '';
            const _this = this;
            // Wait 2 seconds before allowing a request to fetch more products
            setTimeout(function(){        
                _this.bouncable = true;
              }, 500);
            } else {
              this.progress = '';
              this.success = 'No more matching products.';
            }
        },
        (error) => {
          this.progress = '';
          this.error = `Error: Failed to read the list of products – ${error.message}`;
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
            console.error(this.error);
        })
      },
      scroll () {
        window.onscroll = () => {
          const position = 750 + Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight;
          const height = document.documentElement.offsetHeight;
          if (position >= height) {
            if (this.bouncable) {
              if (this.searchTerm === '') {
                this.fetchProductList();
              } else {
                this.searchProducts();
              }
            }
          }
        }
      }
    },
    mounted() {
      this.fetchProductList();
      this.scroll();
  }
}
</script>

<style scoped>
  #product-cards {
    /* background-color: blanchedalmond; */
    max-height: 10%;
    display: flex;
    overflow-y: auto;
    flex-direction: column;
  }

</style>