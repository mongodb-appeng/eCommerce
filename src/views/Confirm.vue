<template>

  <div class="confirm">
    <MyHeader
      v-bind:stitchClient="stitchClient"
      v-bind:userLoggedIn="userLoggedIn" v-on:user-logged-in="setUserLoggedIn"
      v-bind:userFirstName="userFirstName">
    </MyHeader>
    <ConfirmStitchEmail v-bind:stitchClient="stitchClient"> </ConfirmStitchEmail>
    <!-- <AnonymousAuth v-bind:stitchClient="stitchClient" v-on:db="setDB"> </AnonymousAuth> -->
    <!-- <Playground></Playground> -->
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Chance to confirm email"/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import AnonymousAuth from '../components/AnonymousAuth.vue'
import ConfirmStitchEmail from '../components/ConfirmStitchEmail.vue'
import MyHeader from '../components/Header.vue'
// import Playground from '../components/Playground.vue'

export default {
  name: 'confirm',
  props: [
    "stitchClient",
    "userLoggedIn",
    "userFirstName"
  ],
  components: {
    ConfirmStitchEmail,
    MyHeader
  },
  data() {
    // return {
    //   db: ''
    // }
  },
  methods: {
  },
  mounted() {
  }
}
</script>
