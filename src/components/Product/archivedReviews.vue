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

export default {
  name: 'archived-reviews',
  props: [
    'productID'
],
  components: {
  },
  data() {
    return {
        error: '',
        progress: '',
        success: '',
        reviews: [],
        lastId: null,
        bouncable: true
    }
  },
  methods: {
    fetchReviews () {
        this.error = '';
        this.success = '';
        this.progress = "Fetching more reviews";
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
                this.progress = '';
                let _this = this;
                // Wait half a second before allowing a request to fetch more products
                setTimeout(function(){
                    _this.bouncable = true;
                }, 500);
            } else {
                this.progress = '';
            }
        },
        (error => {
            this.progress = '';
            this.error = `Error: Failed to read archived reviews – ${error}`;
            /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
            console.error(this.error);
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
