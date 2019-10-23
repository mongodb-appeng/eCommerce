<template>
<!-- Vue.js view to display the contents of this user's (or customer's) shopping basket. It 
gives them the option to adjust the quantity of any product (or delete the item from 
the basket) before checking out. -->
  <div class="checkout">
    <MyHeader></MyHeader>
    <section class="section">
      <div v-if="stitchReady" class="columns">
        <div class="column is-9 scroll" id="products">
          <div class="container">
            <h3 class="title is-4">Delivery Address</h3>
                <div class="columns container">
                    <div v-if="customer.contact.deliveryAddress" class="column is-9">
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
                    <div v-else class="column is-9">
                      <h4 class="title is-5"><a v-on:click="editAddress">
                        Please provide address
                      </a></h4>
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
                v-if="metaCustomer.shoppingBasketSize > 0 && customer.contact.deliveryAddress"
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
      <Status v-bind:status="status"></Status>
    </section>
  </div>
</template>

<script>
import {
    mapState,
    mapActions,
    mapMutations
    } from 'vuex';
import MyHeader from '../components/Header.vue'
import Status from '../components/Status.vue'
import BasketCards from '../components/Basket/BasketCards.vue'
import { setTimeout } from 'timers';
import config from '../config';
import Stripe from 'stripe'; // see vue.config.js for `externals`

export default {
  name: 'checkout',
  components: {
    MyHeader,
    Status,
    BasketCards
  },
  data() {
    return {
        status: null,
        stitchReady: false,
        paymentMethods: [
            {name: 'Scooby snacks'},
            {name: 'Leafies'},
            {name: 'Credit or debit card'}
        ],
        paymentMethod: 'Credit or debit card'
    }
  },
  computed: {
      ...mapState([
          'customer',
          'metaCustomer'
      ])   
  },
  methods: {
    ...mapActions([
        'emptyBasket',
        'fetchOrders'
    ]),
    ...mapMutations([
        'setCheckoutID'
    ]),

    /**
     * Hold off on rendering anything until we've authenticated with Stitch and have a client
     * connection to use
     */
    waitUntilStitchReady() {
       if (this.$root.$data.stitchClient && this.$root.$data.stitchClient.auth.isLoggedIn) {
         this.stitchReady = true;
       } else {
         let _this = this;
         setTimeout(_this.waitUntilStitchReady, 100);
       }
    },

    /**
     * If the user indicates that they want to change the delivery address, go to the
     * user account page so that they can do so.
     */
    editAddress () {
        this.$router.push({name: 'account'})
    },

    /**
     * Call a Stitch function to submit the order in the backend. If that is succesful then
     * empty the the shopping basked and fetch the new list of orders from the database to 
     * update the frontend state.
     */
    submitOrder () {
      this.$root.$data.stitchClient.callFunction("placeOrder", [this.paymentMethod])
      .then ((results) => {
        if (results && results.result) {
            this.emptyBasket(this.$root.$data.database);
            this.fetchOrders(this.$root.$data.database)
            .then (() => {
                this.status = null;
                this.$router.push({name: 'home'});
            },
            (error) => {
                this.status = {state: 'oror', text: `Failed to fetch list of orders: ${error}`};
            })
        } else {
            this.status = null;
            if (results) {
                this.status = {state: 'error', text: `Error, failed to submit order: ${results.error}`};
            }
        }
      },
        (error) => {
          this.status = {state: 'error', text: `Error: failed to submit order: ${error}`};
        }
      )
    },

    /**
     * If the customer has opted to pay by credit/debit card then call a Stitch function to
     * create a checkout context with the Stripe service and then make the call Stripe
     * service to take the payment.
     */
    checkout () {
      this.status = {state: 'progress', text: 'Submitting order'};
      if (this.paymentMethod === 'Credit or debit card') {
        this.$root.$data.stitchClient.callFunction(
          "stripeCreateCheckoutSession",
          [(Math.round(this.metaCustomer.shoppingBasketValue * 100))/100]
        )
        .then ((checkoutID) => {
          if (checkoutID) {
            const stripe = Stripe(config.stripePublicKey);
            stripe.redirectToCheckout({sessionId: checkoutID});
          } else {
            this.status = {state: 'error', text: 'Failed to process payment'};
          }
        },
        (error) => {
          this.status = {state: 'error', text: `Error, failed to create Stripe checkout session: ${error}`};
        })
      } else {
        this.submitOrder();        
      }
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