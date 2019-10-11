<template>
    <div>
        <div v-if="numberReviews > 0" class="columns">
            <div class="column" id="review-bar">
                <progress class="progress is-warning" :value="score"
            max="5"></progress>
            </div>
            <div class="column is-narrow">
                <small>{{ productRating }}/5 ({{ numberReviews  }} review<span v-if="numberReviews > 1">s</span>) </small>
            </div>
        </div>
    </div>
</template>

<script>
import { 
    mapState, 
    // mapMutations 
    } from 'vuex';

export default {
    name: "Rank",
    props: [
        'score',
        'numberReviews'
    ], 
    components: {
    },
    data() {
        return {
            productRating: 0
        }
    },
    computed: {
        ...mapState([
        ]),
    },
    methods: {
    },
    created() {
        if (this.score === Math.round(this.score)) {
            this.productRating = this.score;
        } else {
            this.productRating = this.score.toFixed(1);
        }
  }
}
</script>
<style scoped>
    #review-bar {
        padding-top: 17px;
    }
</style>