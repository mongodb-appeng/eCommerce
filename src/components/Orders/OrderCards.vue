<template>
    <div>
      <section class="section" id="order-cards">
        <ul id="order-list">
          <li
            v-for="order in customer.orders"
            v-bind:key="order.orderId">
                <OrderCard v-bind:order="order">
                </OrderCard>
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
import OrderCard from "./OrderCard.vue"
import { 
    mapState
    // mapMutations 
    } from 'vuex';

export default {
    name: "OrderCards",
    props: [
    ], 
    components: {
        OrderCard,
    },
    data() {
        return {
          error: '',
          progress: '',
          success: ''
        }
    },
    computed: {
      ...mapState([
        'customer'
      ])
    },
    watch: {
    },
    methods: {
      // ...mapMutations([
      //   ]),
    },
    mounted() {
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