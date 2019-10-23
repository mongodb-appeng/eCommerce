<template>
<!-- View.js component to add one or more instances of a single product to
the shopping basket. The user doesn't need to log in to add items to
the basket. -->
  <div>
    <section class="section">
      <div v-if="stockLevel > 0">
        <p><span class="has-text-primary">{{ stockLevel }} units in stock</span></p>
          <div class="field">
              <div class="field-body">
                  <div class="field">
                      <label >
                          Quantity: 
                          <div class="select is-small">
                            <select v-model="quantity">
                              <option 
                                v-for="num in Math.min(20, stockLevel)"
                                v-bind:key="num"
                                >
                                  {{ num }}
                              </option>
                            </select>
                          </div>
                      </label>
                  </div>
              </div>
          </div>
          <div>
            <p>
              ${{ (quantity *  price).toFixed(2) }}
              <br/>
            </p>
          </div>
          <div class="buttons are-small">
            <p>
              <a v-if="quantity > 0" v-on:click="newBasketItem" class="button is-primary is-small is-focused">
                  <span class="icon is-small">
                      <i class="fas fa-cart-plus"></i>
                  </span>
                  <span>Add to basket</span>
              </a>
              <a v-else class="button is-grey is-small" disabled>
                  <span class="icon is-small">
                      <i class="fas fa-cart-plus"></i>
                  </span>
                  <span>Add to basket</span>
              </a>
            </p>
          </div>
      </div>
      <div v-else class="field">
        <p>
          <span class="has-text-danger">
            Product is out of stock
          </span>
        </p>
        <label class="checkbox">
          <input 
            type="checkbox"
            v-model="notifyMe"
            v-on:change="notificationChange"
          >
            Notify me when back in stock
        </label>
      </div>
      <Status v-bind:status="status"></Status>
    </section>
  </div>
</template>

<script>
import Status from '../Status.vue'
import {
    mapState,
    mapMutations,
    mapActions
    } from 'vuex';

export default {
  name: 'purchase-box',
  components: {
      Status
  },
  props: [
    'stockLevel',
    'productID',
    'productName',
    'price',
    'productImage'
  ],
  data() {
    return {
      status: null,
      notifyMe: false,
      quantity: 0
    }
  },
  computed: {
    ...mapState([
      'customer',
      'userLoggedIn'
    ]),
  },
  methods: {
    ...mapMutations([
      'setWaitingOnProducts'
    ]),
    ...mapActions([
        'addToBasket'
    ]),

    /**
     * The user has toggled the button to indicate that they want to start or stop
     * watching an item (i.e. wait for a notification when the product is back) in
     * stock. Updates both the `customer` document in Atlas and the frontend Vuex
     * state.
     */
    notificationChange () {
      if (this.userLoggedIn) {
        if (!this.customer.waitingOnProducts) {
          this.customer.waitingOnProducts = [];
        }
        if (this.notifyMe && !this.customer.waitingOnProducts.includes(this.productID)) {
          this.customer.waitingOnProducts.push(this.productID);
        } else if (!this.notifyMe && this.customer.waitingOnProducts.includes(this.productID)) {
          let index = this.customer.waitingOnProducts.indexOf(this.productID);
          this.customer.waitingOnProducts.splice(index, 1);
        }
        this.status = {state: 'progress', text: 'Updating customer'};
        this.$root.$data.database.collection("customers").updateOne(
          {"contact.email": this.customer.contact.email},
          {$set: {waitingOnProducts: this.customer.waitingOnProducts}}
        )
        .then (() => {
          this.setWaitingOnProducts(this.customer.waitingOnProducts);
          this.status = {state: 'success', text: 'Customer document updated', time: 2000};
        }, (error => {
          this.status = {state: 'error', text: `Failed to update the customer document: ${error}`};
          this.notifyMe = !this.notifyMe;
        })
      )
      } else {
        this.status = {state: 'error', text: 'You must log in first', time: 2000};
        this.notifyMe = false;
      } 
    },

    /**
     * Add one or more instances of the product to the shopping basket. Updates both the `
     * customer` document in Atlas and the frontend Vuex state (via the `addToBasket` action).
     */
    newBasketItem () {
      const quantityToAdd = parseInt(this.quantity);
      this.quantity = 0;
      this.addToBasket({
        database: this.$root.$data.database,
        itemArray: [{
          productID: this.productID,
          productName: this.productName,
          price: this.price,
          productImage: this.productImage,
          quantity: quantityToAdd
        }]
      })
    }
  },
mounted() {
  this.notifyMe = this.customer.waitingOnProducts && this.customer.waitingOnProducts.includes(this.productID);
}}
</script>

<style scoped>
.button {
  margin-top: 15px;
}
</style>
