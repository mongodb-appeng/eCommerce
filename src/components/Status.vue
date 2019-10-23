<template>
<!-- Vue.js component to display status messages (progress, success, or error).
Formating is dependent on the type of message. -->
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
        /**
         * When the `status` parameter changes, render the new message and if it's
         * an error message AND error logging is enabled then write it to the error log.
         * Can optionally indicate a time after which the message should be cleared.
         * @param {object} status
         * @param {string} status.state - One of 'error', 'progress', or 'success'
         * @param {string} state.text - The message to be rendered
         * @param {number} state.time - (Optional) Time in milleseconds that the messaged should be displayed for
         */
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