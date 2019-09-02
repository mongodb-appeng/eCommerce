<template>
    <div>
      <ul id="product-list">
        <li
          v-for="productId in productIds"
          v-bind:key="productId">
            <ProductCard
              v-bind:stitchClient="stitchClient"
              v-bind:database="database"
              v-bind:customer="customer"
              v-bind:userFirstName="userFirstName"
              v-bind:productId="productId">,
            </ProductCard>
        </li>
      </ul>

    </div>
</template>

<script>
import ProductCard from "../components/ProductCard.vue"

export default {
    name: "ProductCards",
    props: [
        "userLoggedIn",
        "userFirstName",
        "stitchClient",
        "customer",
        "database"
    ], 
    components: {
        ProductCard
    },
    data() {
        return {
          // TODO this should probably be $props
          productIds: [1234567,9999]
        }
    },
    methods: {

    },
    created() {
  }
}
</script>

<style scoped>
</style>