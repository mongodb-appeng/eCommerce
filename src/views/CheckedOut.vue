<template>
  <div class="checked-out">
    <MyHeader></MyHeader>
    <div>
      <AnonymousAuth></AnonymousAuth>
      <h3 class="title is-4">Thanks for your payment</h3>
    </div>
    <section class="section">
      <div v-if="stitchReady && product">
          
      </div>
    </section>
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
import {
    mapState,
    // mapMutations
    } from 'vuex';
import MyHeader from '../components/Header.vue'
import AnonymousAuth from '../components/AnonymousAuth.vue'
import { setTimeout } from 'timers';

export default {
  name: 'checkedout',
  props: [
  ],
  components: {
    AnonymousAuth,
    MyHeader
  },
  data() {
    return {
      error: '',
      progress: '',
      success: '',
      stitchReady: false,
      stripeSessionID: null
    }
  },
  computed: {
      ...mapState([
          'userLoggedIn',
          'stitchClient',
          'database'
      ]),
  },
  methods: {
    waitUntilStitchReady() {
      if (this.stitchClient && this.stitchClient.auth.isLoggedIn) {
        this.stitchReady = true;
        this.fetchProduct();
      } else {
        let _this = this;
        setTimeout(_this.waitUntilStitchReady, 100);
      }
    }
  },
  mounted() {
    this.stripeSessionID = this.$route.query.session_id;
    this.waitUntilStitchReady();
  }
}
</script>

<style scoped>
</style>
