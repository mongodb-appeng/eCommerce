<template>
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
    mapActions,
    // mapMutations 
    } from 'vuex';

export default {
    name: "OrderCard",
    props: [
        'order',
    ], 
    components: {
    },
    data() {
        return {
            success: '',
            progress: '',
            error: ''
        }
    },
    computed: {
        ...mapState([
        ]),
    },
    methods: {
        ...mapActions([
            'deleteOrder'
        ]),
        removeOrder () {
            this.progress = 'Deleting order';
            this.deleteOrder (this.order.orderID);
            this.progress = '';
        }
    },
    mounted() {

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