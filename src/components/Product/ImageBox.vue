<template>
  <div class>
    <section class="section">
      <div class="columns">
        <div class="column is-2 restrict-height">
          <ul id="product-images">
            <li
              v-for="productImage in productImages"
              v-bind:key="productImage"
              v-on:mouseover="currentImage = productImage">
              <a>
                <div class="box">
                  <figure class="image is-square">
                    <img :src="productImage" >
                  </figure>
                </div>
              </a>
            </li>
          </ul>
        </div>
        <div class="column is-10">
          <figure class="image is-square" v-if="currentImage">
            <img :src="currentImage" alt="">
          </figure>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'image-box',
  props: [
    'productImages'
  ],
  data() {
    return {
      currentImage: null
    }
  },
  created() {
    if (this.productImages && this.productImages.length > 0) {
      this.currentImage = this.productImages[0];
    }
  }
}
</script>

<style scoped>
div.box {
  padding: 0.25rem
}
</style>
