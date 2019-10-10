<template>
  <div class="checkout">
    <MyHeader></MyHeader>
    <div v-if="!userLoggedIn">
      <AnonymousAuth></AnonymousAuth>
    </div>
    <section class="section">
      <div v-if="stitchReady" class="columns">
        <div class="column is-9 scroll" id="products">
          <div class="container">
            <h3 class="title is-4">Delivery Address</h3>
                <div class="columns container">
                    <div class="column is-9">
                        {{ customer.name.title}} {{ customer.name.first }} {{ customer.name.last }}
                        <br/>
                        {{ customer.contact.deliveryAddress.number }}
                        {{ customer.contact.deliveryAddress.street }}
                        <br/>
                        {{ customer.contact.deliveryAddress.city }}
                        <br/>
                        {{ customer.contact.deliveryAddress.state }}
                        <br/>
                        {{ customer.contact.deliveryAddress.postalCode }}
                    </div>
                    <div class="column is-2">
                        <a  v-on:click="editAddress" 
                            class="button is-small">
                            <span class="icon">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span>Edit address</span>
                        </a>
                    </div>
                </div>
            <h3 class="title is-4">Payment method</h3>
            <div class="columns container">
                <div class="column is-9">
                    <div v-for="method in paymentMethods" v-bind:key="method.name">
                        <input type="radio" v-model="paymentMethod" name="paymentMethod" :value="method.name"> {{ method.name }}
                    </div>
                </div>
                <div class="column is-2">
                    <a  v-on:click="editAddress" 
                        class="button is-small">
                        <span class="icon">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span>Payment options</span>
                    </a>
                </div>
            </div>
            <h3 class="title is-4">Order items</h3>
            <BasketCards>
            </BasketCards>           
          </div>
        </div>
        <div class="column is-3 restrict-height">
          <div class="container">
              <strong>Basket Total: ${{ metaCustomer.shoppingBasketValue.toFixed(2) }}</strong>
          </div>
            <div class="buttons">
            <p>
              <a 
                v-if="metaCustomer.shoppingBasketSize > 0" 
                v-on:click="checkout" 
                class="button is-primary  is-focused">
                  <span class="icon">
                      <i class="fas fa-wallet"></i>
                  </span>
                  <span>Pay now</span>
              </a>
              <a v-else class="button is-grey" disabled>
                  <span class="icon">
                      <i class="fas fa-wallet"></i>
                  </span>
                  <span>Pay now</span>
              </a>
            </p>
          </div>
        </div>
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
    mapActions
    // mapMutations
    } from 'vuex';
import MyHeader from '../components/Header.vue'
import AnonymousAuth from '../components/AnonymousAuth.vue'
import BasketCards from '../components/Basket/BasketCards.vue'
import { setTimeout } from 'timers';

export default {
  name: 'checkout',
  props: [
  ],
  components: {
    AnonymousAuth,
    MyHeader,
    BasketCards
  },
  data() {
    return {
        error: '',
        progress: '',
        success: '',
        path: [],
        stitchReady: false,
        // TODO payment methods should be attributes of the customer
        paymentMethods: [
            {name: 'Scooby snacks'},
            {name: 'Leafies'}
        ],
        paymentMethod: 'Scooby snacks'
        }
  },
  computed: {
      ...mapState([
          'userLoggedIn',
          'stitchClient',
          'customer',
          'metaCustomer'
      ])
  },
  methods: {
    ...mapActions([
        'emptyBasket',
        'fetchOrders'
    ]),
    waitUntilStitchReady() {
       if (this.stitchClient && this.stitchClient.auth.isLoggedIn) {
         this.stitchReady = true;
       } else {
         let _this = this;
         setTimeout(_this.waitUntilStitchReady, 100);
       }
    },
    editAddress () {
        this.$router.push({name: 'account'})
    },

    checkout () {
      this.progress = 'Submitting order';
      this.stitchClient.callFunction("placeOrder", [this.paymentMethod])
        .then ((results) => {
            if (results && results.result) {
                this.emptyBasket();
                this.fetchOrders()
                .then (() => {
                    this.progress = '';
                    this.$router.push({name: 'home'});
                },
                (err) => {
                    this.progress = '';
                    this.error = `Failed to fetch list of orders: ${err}`;
                })
            } else {
                this.progress = '';
                if (results) {
                    this.error = results.error;
                    /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                    console.error(this.error);
                }
            }
        },
        (err) => {
            this.progress = '';
            this.error = `Error: failed to submit order: ${err.message}`
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
            console.error(this.error);
        })
    }
  },
  mounted() {
    this.waitUntilStitchReady();
  }
}
</script>

<style scoped>
.restrict-height {
  height: 75vh;
  overflow: scroll;
}
.button.is-small {
    float: right;
}
</style>
