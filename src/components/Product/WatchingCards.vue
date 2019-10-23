<template>
<!-- View.js component to display all of the products that the current user is "wathcing"
(waiting for a notification when the product is back in stock). Also gives the 
option to stop watching a product. -->
  <div> 
      <section class="section" id="watching-cards">
        <div v-if="customer.waitingOnProducts.length > 0">
            <ul id="watch-list">
                <li
                    v-for="productID in customer.waitingOnProducts"
                    v-bind:key="productID">
                        <WatchingCard v-bind:productID="productID">
                        </WatchingCard>
                </li>
            </ul>
        </div>
        <div v-else>
            <h3 class="title is-4">Not currently watching any products</h3>
        </div>
      </section>
      <br>
    </div>
</template>

<script>
import WatchingCard from "./WatchingCard.vue"
import { mapState } from 'vuex';

export default {
    name: "WatchingCards",
    components: {
        WatchingCard
    },
    data() {
        return {
          status: null
        }
    },
    computed: {
      ...mapState([
        'customer'
      ])
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