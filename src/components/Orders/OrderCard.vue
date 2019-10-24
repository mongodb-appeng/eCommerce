<template>
<!-- Vue.js component to render an individual order. If an order hasn't yet shipped
then the customer is able to click on an icon to cancel the order. -->
    <div>
        <div class="box">
            <article class="media">
                <div class="media-left">
                    <figure class="image is-64x64">
                        <img :src="order.items[0].productImage">
                    </figure>
                </div>
                <div class="media-content">
                    <div class="columns">
                        <div class="column is-10">
                            <h6 class="title is-6">{{ order.orderID }}</h6>
                            <p>
                                {{ order.items.length }} 
                                <span v-if="order.items.length === 1">item</span>
                                <span v-else>items</span>
                            </p>
                            <p>
                                Ordered: {{ order.orderDate }}
                            </p>
                            <p>
                                Order status: {{ order.status}}
                            </p>
                        </div>
                        <div class="column is-2">
                            <strong>${{ order.totalPrice.toFixed(2) }}</strong>
                        </div>
                    </div>
                    <nav class="level is-mobile">
                        <div v-if="order.status != 'shipped' && order.status != 'completed'" class="level-left">
                            <a class="level-item" aria-label="trash" v-on:click="removeOrder">
                                <span class="icon is-small">
                                <i class="fas fa-trash" aria-hidden="true"></i>
                                </span>
                            </a>
                        </div>
                    </nav>
                    <Status v-bind:status="status"></Status>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
import Status from '../Status.vue'
import { mapActions } from 'vuex';

export default {
    name: "OrderCard",
    props: [
        'order',
    ], 
    components: {
        Status
    },
    data() {
        return {
            status: null
        }
    },
    methods: {
        ...mapActions([
            'deleteOrder'
        ]),

        /**
         * Remove the order from the customer document in the database, as
         * well as from the frontend Vuex state.
         */
        removeOrder () {
            this.status = {state: 'progress', text: 'Deleting order'};
            this.deleteOrder ({
                database: this.$root.$data.database,
                stitchClient: this.$root.$data.stitchClient,
                orderID: this.order.orderID
            })
            .then(() => {
                this.status = {state: 'success', text: 'Order deleted', time: 2000};
            },
            (error) => {
                this.status = {state: 'error', text: `Failed to delete the order: ${error}`};
            })
        }
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
</style>