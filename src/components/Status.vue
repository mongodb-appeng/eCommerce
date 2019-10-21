<template>
    <div
        v-if="componentStatus" 
        class="notification"
        v-bind:class="{
            'is-primary': componentStatus.state == 'progress',
            'is-success': componentStatus.state == 'success',
            'is-danger': componentStatus.state == 'error'
            }">
        {{ componentStatus.text }}
    </div>
</template>

<script>
import config from '../config';
import { setTimeout } from 'timers';

export default {
    name: 'status',
    props: [
        'status'    // status = {
    ],              //      state: error | progress | success,
                    //      text: string, 
                    //      time: int      // Optional - how many msecs the status should be displayed for.
                    // }
    data() {
        return {
            componentStatus: null
        }
    },
    watch: {
        status: function (status) {
            this.componentStatus = status;
            if (status && status.state === 'error' && config.logErrors) {
                /*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
                console.error(status.text);
            }
            if (status && status.time) {
                setTimeout(() => {this.componentStatus = null}, status.time);
            }
        }
    },
    mounted() {
        this.componentStatus = this.status;
    }
}
</script>