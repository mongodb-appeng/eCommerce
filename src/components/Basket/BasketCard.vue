<template>
    <div>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-64x64">
                        <img :src="product.productImage">
                    </figure>
                </div>
                <div class="media-content">
                    <div class="columns">
                        <div class="column is-8">
                            <h6 class="title is-6">{{ product.productName }}</h6>
                        </div>
                        <div class="column is-2">
                            ${{ product.price }} each
                        </div>
                        <div class="column is-2">
                            <strong>${{ (product.price * product.quantity).toFixed(2)}}</strong> total
                        </div>
                    </div>
                    <nav class="level is-mobile">
                        <div class="level-left">
                            <a class="level-item" aria-label="trash" v-on:click="deleteItem">
                                <span class="icon is-small">
                                <i class="fas fa-trash" aria-hidden="true"></i>
                                </span>
                            </a>
                            <a class="level-item" aria-label="minus" v-on:click="decrementItem">
                                <span class="icon is-small">
                                <i class="fas fa-minus-square" aria-hidden="true"></i>
                                </span>
                            </a>
                                <span class="iconNumber">
                                    {{ product.quantity }}
                                </span>
                            <a class="level-item" aria-label="plus" v-on:click="incrementItem">
                                <span class="icon is-small">
                                <i class="fas fa-plus-square" aria-hidden="true"></i>
                                </span>
                            </a>
                        </div>
                    </nav>
                    <div v-if="progress" class="notification is-info">
                        {{ progress }}
                    </div>
                    <div v-if="error" class="notification is-danger">
                        <strong>{{ error }}</strong>
                    </div>
                    <div v-if="success" class="notification is-success">
                        {{ success }}
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import { 
    mapState, 
    mapMutations,
    mapActions
    } from 'vuex';

export default {
    name: "BasketCard",
    props: [
        'product'
    ], 
    components: {
    },
    data() {
        return {
            success: '',
            progress: '',
            error: '',
            newQuantity: 0
        }
    },
    computed: {
        ...mapState([
        ]),
    },
    methods: {
    ...mapMutations([
    ]),
    ...mapActions([
        'deleteFromBasket',
        'updateBasketItemQuantity'
    ]),
        deleteItem () {
            this.deleteFromBasket(this.product.productID);
        },

        incrementItem () {
            this.updateBasketItemQuantity(
                {
                    productID: this.product.productID,
                    quantity: this.product.quantity + 1
                }
            )
            // this.$emit('updateQuantity', this.product.productID, this.product.quantity + 1);
        },

        decrementItem () {
            if (this.product.quantity > 0) {
                this.updateBasketItemQuantity(
                    {
                        productID: this.product.productID,
                        quantity: this.product.quantity - 1
                    }
                )
            }
        },      
    },
    mounted() {
        this.newQuantity = this.product.quantity;
  }
}
</script>
<style scoped>
    .title.is-6 {
        margin-bottom: 0px;
    }
    .box {
        margin-bottom: .75em; 
    }
    span.iconNumber {
        margin-right: .75em;
    }
</style>