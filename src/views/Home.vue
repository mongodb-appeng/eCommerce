<template>
  <div class="home">
    <MyHeader
      v-bind:stitchClient="stitchClient"
      v-bind:database="database"
      v-bind:customer="customer"
      v-bind:userLoggedIn="userLoggedIn" v-on:user-logged-in="setUserLoggedIn"
      v-bind:userFirstName="userFirstName">
    </MyHeader>
    <div v-if="!userLoggedIn">
      <AnonymousAuth v-bind:stitchClient="stitchClient" v-on:setDatabase="setDatabase"> </AnonymousAuth>
    </div>
    <div>
      <ProductCards
        v-bind:stitchClient="stitchClient"
        v-bind:database="database"
        v-bind:customer="customer"
        v-bind:userLoggedIn="userLoggedIn" v-on:user-logged-in="setUserLoggedIn"
        v-bind:userFirstName="userFirstName">
      </ProductCards>
    </div>
  </div>
</template>

<script>
import MyHeader from '../components/Header.vue'
import AnonymousAuth from '../components/AnonymousAuth.vue'
import ProductCards from '../components/ProductCards.vue'

export default {
  name: 'home',
  props: [
    "stitchClient",
    "database",
    "userLoggedIn",
    "userFirstName",
    "customer"
  ],
  components: {
    AnonymousAuth,
    MyHeader,
    ProductCards
  },
  data() {
    return {
    }
  },
  methods: {
    setDatabase(database) {
      this.$emit("setDatabase", database)
    },
    setUserLoggedIn (user) {
      this.$emit("user-logged-in", user)
    }
  },
  mounted() { 
  }
}
</script>
