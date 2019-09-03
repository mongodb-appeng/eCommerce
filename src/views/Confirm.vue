<template>

  <div class="confirm">
    <MyHeader></MyHeader>
    <!-- <MyHeader
      v-bind:stitchClient="stitchClient"
      v-bind:customer="customer"
      v-bind:userLoggedIn="userLoggedIn" v-on:user-logged-in="setUserLoggedIn"
      v-bind:userFirstName="userFirstName">
    </MyHeader> -->
    <ConfirmStitchEmail></ConfirmStitchEmail>
    <!-- <ConfirmStitchEmail v-bind:stitchClient="stitchClient"> </ConfirmStitchEmail> -->
  </div>
</template>

<script>
import ConfirmStitchEmail from '../components/ConfirmStitchEmail.vue'
import MyHeader from '../components/Header.vue'

export default {
  name: 'confirm',
  props: [
    // "stitchClient",
    // "userLoggedIn",
    // "userFirstName",
    // "customer"
  ],
  components: {
    ConfirmStitchEmail,
    MyHeader
  },
  data() {
  },
  methods: {
  },
  mounted() {
  }
}
</script>
