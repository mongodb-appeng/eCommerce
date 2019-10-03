<template>
  <div>
    <section class="section">
      <span v-if="stockLevel > 0" class="has-text-primary">{{ stockLevel }} units in stock</span>
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
    mapMutations
    } from 'vuex';

export default {
  name: 'purchase-box',
  props: [
    'stockLevel',
    'productID'
  ],
  components: {
  },
  data() {
    return {
      progress: '',
      error: '',
      success: '',
      notifyMe: false
    }
  },
  computed: {
    ...mapState([
      'customer',
      'userLoggedIn',
      'database'
    ]),
  },
  methods: {
    ...mapMutations([
      'setWaitingOnProducts'
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
        this.database.collection("customers").updateOne(
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

</style>
