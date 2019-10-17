<template>
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
      <div v-if="progress" class="notification is-info">
          {{ progress }}
      </div>
      <div v-if="error" class="notification is-danger">
          <strong>{{ error }}</strong>
      </div>
      <div v-if="success" class="notification is-success">
          {{ success }}
      </div>
    </section>
  </div>
</template>

<script>
import {
    mapState,
    mapMutations,
    mapActions
    } from 'vuex';

export default {
  name: 'purchase-box',
  props: [
    'stockLevel',
    'productID',
    'productName',
    'price',
    'productImage'
  ],
  components: {
  },
  data() {
    return {
      progress: '',
      error: '',
      success: '',
      notifyMe: false,
      quantity: 0
    }
  },
  computed: {
    ...mapState([
      'customer',
      'userLoggedIn'
      // 'database'
    ]),
  },
  methods: {
    ...mapMutations([
      'setWaitingOnProducts'
    ]),
    ...mapActions([
        'addToBasket'
    ]),

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
        this.progress = "Updating customer"
        this.$root.$data.database.collection("customers").updateOne(
          {"contact.email": this.customer.contact.email},
          {$set: {waitingOnProducts: this.customer.waitingOnProducts}}
        )
        .then (() => {
          this.setWaitingOnProducts(this.customer.waitingOnProducts);
          this.progress = '';
          this.success = 'Customer document updated';
          const _this = this;
          setTimeout(function(){
            _this.success = '';
          }, 2000);
        }, (err => {
          this.progress = '';
          this.error = `Failed to update the customer document: ${err.massage}`;
          this.notifyMe = !this.notifyMe;
        })
        )
      } else {
        this.error = "You must log in first";
        this.notifyMe = false;
        const _this = this;
        setTimeout(function(){
          _this.error = '';
        }, 2000);
      } 
    },

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
    if (this.customer.waitingOnProducts && this.customer.waitingOnProducts.includes(this.productID)) {
      this.notifyMe = true;
    } else {
      this.notifyMe = false;
    }
  }
}
</script>

<style scoped>
.button {
  margin-top: 15px;
}
</style>
