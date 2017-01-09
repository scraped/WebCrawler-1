<template>
    <modal v-if="showModal" @close="showModal = false">
        <h3 slot="header">Account activation</h3>
        <div slot="body">
           aze
        </div>
    </modal>
</template>
<script>
import Modal from '../../App/Modal/Modal.vue'
export default {
    components: {
        modal: Modal
    },
    data() {
        return {
            showModal: true
        }
    }
}
</script>
