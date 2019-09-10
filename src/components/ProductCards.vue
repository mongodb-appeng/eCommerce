<template>
    <div>
      <section class="section" id="product-cards">
        <ul id="product-list">
          <li
            v-for="product in products"
            v-bind:key="product.productId">
              <ProductCard
                v-bind:product="product">
              </ProductCard>            
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
import ProductCard from "../components/ProductCard.vue"
import { 
    mapState, 
    mapMutations 
    } from 'vuex';

export default {
    name: "ProductCards",
    props: [
    ], 
    components: {
        ProductCard
    },
    data() {
        return {
          error: '',
          progress: '',
          success: '',
          products: [],
          bouncable: false,
          lastProductID: ""
        }
    },
    computed: {
      ...mapState([
          'database',
          'firstRodeo'
      ]),
    },
    methods: {
      ...mapMutations([
            'notFirstRodeo'
        ]),
      fetchProductList () {
        this.error = '';
        this.success = '';
        this.progress = "Fetching product list";
        this.bouncable = false;
        this.database.collection("products")
        .find(
          {productID: {$gt: this.lastProductID}},
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
              "reviews.numberOfReviews": 1,
            },
            // TODO should probably find something better to sort on (like) review scores
            // but need to figure out how to not break the efficient pagination
            sort: {productID: 1},
            limit: 20
          }
        ).toArray()
        .then ((docArray) => {
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
              this.fetchProductList();
            }
          }
        }
      },
      safeFetchProductList () {
        /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
        console.log(`firstRodeo: ${this.firstRodeo}`)
        if (this.firstRodeo) {
          let _this = this;
          this.progress = 'Waiting to connect with the backend service.';
          /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
          console.log('Waiting');
          setTimeout(function(){
              _this.fetchProductList();
            }, 1000);
        } else {
          this.notFirstRodeo();
          this.fetchProductList();
        }
      }
    },
    mounted() {
      this.safeFetchProductList();
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