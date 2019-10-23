<template>
<!-- Vue.js component which renders a list of a customer's most recent orders, 
using the `OrderCard` component to render each order. Note that the older orders
(stored in the `orderOverflow` are not currently included. -->
    <div>
      <section class="section" id="order-cards">
        <div v-if="customer.orders.length > 0">
            <ul id="order-list">
            <li
                v-for="order in customer.orders"
                v-bind:key="order.orderId">
                  <OrderCard v-bind:order="order"></OrderCard>
            </li>
            </ul>
        </div>
        <div v-else>
            <h3 class="title is-4">No orders submitted yet</h3>
        </div>
      </section>
      <br>
    </div>
</template>

<script>
import OrderCard from "./OrderCard.vue"
import { mapState } from 'vuex';

export default {
    name: "OrderCards",
    props: [
    ], 
    components: {
        OrderCard,
    },
    computed: {
      ...mapState([
        'customer'
      ])
    },
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