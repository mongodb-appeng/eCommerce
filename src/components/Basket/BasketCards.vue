<template>
<!-- View.js component to show all of the products within the customer's shopping
basket. Embeds an instance of the `BasketCard` to render the details of
each product in the basket. -->
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
    </div>
</template>

<script>
import BasketCard from "./BasketCard.vue"
import {mapState} from 'vuex';

export default {
  name: "BasketCards",
  components: {
      BasketCard,
  },
  computed: {
    ...mapState([
      'customer'
    ])
  }
}
</script>