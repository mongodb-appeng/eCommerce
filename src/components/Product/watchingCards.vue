<template>
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
import WatchingCard from "./WatchingCard.vue"
import { 
    mapState
    // mapMutations 
    } from 'vuex';

export default {
    name: "WatchingCards",
    props: [
    ], 
    components: {
        WatchingCard,
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