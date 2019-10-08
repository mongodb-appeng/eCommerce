<template>
    <div>
      <section class="section" id="basket-cards">
        <ul id="basket-list">
          <li
            v-for="product in customer.shoppingBasket"
            v-bind:key="product.productId">
                <BasketCard v-bind:product="product">
                </BasketCard>
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
import BasketCard from "./BasketCard.vue"
import { 
    mapState
    // mapMutations 
    } from 'vuex';

export default {
    name: "BasketCards",
    props: [
    ], 
    components: {
        BasketCard,
    },
    data() {
        return {
          error: '',
          progress: '',
          success: ''
        //   basket: []
        }
    },
    computed: {
      ...mapState([
        'database', // TODO needed?
        'customer'
      ])
    },
    watch: {
    //   searchTerm: function () {
    //     this.lastProductID = '';
    //     this.lastInterest = 10000;
    //     this.lastScore = 10000;
    //     this.products = [];
    //     this.searchProducts();
    //   }
    },
    methods: {
      // ...mapMutations([
      //   ]),
    },
    mounted() {
        // this.basket = this.customer.shoppingBasket.slice();
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