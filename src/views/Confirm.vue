<template>
  <div class="confirm">
    <MyHeader></MyHeader>
    <ConfirmStitchEmail></ConfirmStitchEmail>
  </div>
</template>

<script>
import ConfirmStitchEmail from '../components/ConfirmStitchEmail.vue'
import MyHeader from '../components/Header.vue'

export default {
  name: 'confirm',
  props: [
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
