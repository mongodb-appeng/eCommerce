<template>
  <div class="container">
      <ul id="review-list">
        <li
          v-for="review in reviews"
          v-bind:key="review.review">
            <div class="box">
              {{ review.review }} <br/><br/>
                <div class="level-left">
                    <a v-for="rank in [1, 2, 3, 4, 5]" v-bind:key="rank" class="level-item">
                      <span v-if="review.score >= rank" class="icon is-small has-text-warning">
                        <i class="fas fa-star"></i>
                      </span>
                      <span v-else class="icon is-small has-text-warning">
                        <i class="far fa-star"></i>
                      </span>
                    </a>
                </div>
            </div>
        </li>
      </ul>
      <Status v-bind:status="status"></Status>
  </div>
</template>

<script>
import Status from '../Status.vue'

export default {
  name: 'archived-reviews',
  props: [
    'productID'
],
  components: {
    Status
  },
  data() {
    return {
        status: null,
        reviews: [],
        lastId: null,
        bouncable: true
    }
  },
  methods: {
    fetchReviews () {
        this.status = {state: 'progress', text: 'Fetching more reviews'};
        this.bouncable = false;
        let query = null;
        if (this.lastId) {
            query = {
                productID: this.productID,
                _id: {$lt: this.lastId}
            }
        } else {
            query = {
                productID: this.productID
            }
        }
        this.$root.$data.database.collection("reviewOverflow")
        .find(query, {sort: {_id: -1}, limit: 20})
        .toArray()
        .then ((docArray) => {
            if (docArray.length > 0) {
                this.lastId = docArray[docArray.length - 1]._id;
                docArray.forEach((item) => {
                    this.reviews.push(item);
                });
                this.status = null;
                let _this = this;
                // Wait half a second before allowing a request to fetch more products
                setTimeout(function(){
                    _this.bouncable = true;
                }, 500);
            } else {
                this.status = null;
            }
        },
        (error => {
            this.status = {state: 'error', text: `Error: Failed to read archived reviews – ${error}`};
        }))
    },
    scroll () {
        window.onscroll = () => {
          const position = 750 + Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight;
          const height = document.documentElement.offsetHeight;
          if (position >= height) {
            if (this.bouncable) {
                this.fetchReviews();
            }
          }
        }
    }
  },
  mounted() {
      this.scroll();
  }
}
</script>

<style scoped>
    .box {
        margin-bottom: .75em; 
    }
</style>
