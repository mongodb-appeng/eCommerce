<template>
<!-- Vue.js view – this is where the user is directed when following the link emailed to them
after registering. By following the CTA, the user confirms their email address. This
view will not be used if email confirmation is turned off in the Stitch app. -->
  <div class="confirm-email">
    <MyHeader></MyHeader>
    <ConfirmStitchEmail></ConfirmStitchEmail>
  </div>
</template>

<script>
import ConfirmStitchEmail from '../components/ConfirmStitchEmail.vue'
import MyHeader from '../components/Header.vue'

export default {
  name: 'confirm',
  components: {
    ConfirmStitchEmail,
    MyHeader
  }
}
</script>
