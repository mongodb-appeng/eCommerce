<template>
    <div class="container" id="add-review">
        <div v-if="userLoggedIn" class="notification">
            <h1 class="title is-2">Review this product</h1>
            <textarea
                v-model="comment"
                class="textarea"
                id="comment"
                placeholder="Tell us what you think about this product"
            ></textarea>
            <br/>
            <div class="box">
                <div class="level-left">
                    <span v-on:click="setStars(1)">
                        <span v-if="stars >= 1" class="icon is-small has-text-warning">
                            <i class="fas fa-star"></i>
                        </span>
                        <span v-else class="icon is-small has-text-warning">
                            <i class="far fa-star"></i>
                        </span>
                    </span>
                    <span v-on:click="setStars(2)">
                        <span v-if="stars >= 2" class="icon is-small has-text-warning">
                            <i class="fas fa-star"></i>
                        </span>
                        <span v-else class="icon is-small has-text-warning">
                            <i class="far fa-star"></i>
                        </span>
                    </span>
                    <span v-on:click="setStars(3)">
                        <span v-if="stars >= 3" class="icon is-small has-text-warning">
                            <i class="fas fa-star"></i>
                        </span>
                        <span v-else class="icon is-small has-text-warning">
                            <i class="far fa-star"></i>
                        </span>
                    </span>
                    <span v-on:click="setStars(4)">
                        <span v-if="stars >= 4" class="icon is-small has-text-warning">
                            <i class="fas fa-star"></i>
                        </span>
                        <span v-else class="icon is-small has-text-warning">
                            <i class="far fa-star"></i>
                        </span>
                    </span>
                    <span v-on:click="setStars(5)">
                        <span v-if="stars >= 5" class="icon is-small has-text-warning">
                            <i class="fas fa-star"></i>
                        </span>
                        <span v-else class="icon is-small has-text-warning">
                            <i class="far fa-star"></i>
                        </span>
                    </span>
                </div>
            </div>
            <div class="field is-grouped is-grouped-centered">
                <p class="control">
                    <button v-on:click="postReview" class="button is-success is-medium is-focused">
                        <span class="icon is-small">
                            <i class="far fa-save"></i>
                        </span>
                        <span>Post review</span>
                    </button>
                </p>
            </div>
        </div>
        <div v-else class="notification is-warning">
            <strong>You must be logged in to submit a review</strong>
        </div>
        <div v-if="error" class="notification is-danger">
            <strong>{{ error }}</strong>
        </div>
        <div v-if="error" class="notification is-primary">
            <strong>{{ progress }}</strong>
        </div>
        <div v-if="success" class="notification is-success">
            {{ success }}
        </div>
    </div>
</template>

<script>

export default {
    name: "addReview",
    props: [
        'productID',
        'reviews'
    ], 
    data() {
        return {
            error: '',
            success: '',
            progress: '',
            comment: '',
            stars: 0,
        }
    },
    methods: {
        setStars(stars) {
            this.stars = stars;
        },
        postReview () {
            this.$root.$data.stitchClient.callFunction("addReview", [
                this.productID,
                this.comment,
                this.stars
            ])
            .then ((results) => {
                if (results && results.averageReviewScore && results.numberOfReviews) {
                    let stats = {
                        averageReviewScore: results.averageReviewScore,
                        numberOfReviews: results.numberOfReviews
                    }
                    this.$emit('reviewStats', stats);
                    this.$emit('review', {review: this.comment, score: this.stars});
                }
            },
            (error) => {
                this.error = `Error: failed to post review: ${error}`;
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */   
                console.error(this.error);
            })
        }
    }
}
</script>