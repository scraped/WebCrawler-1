<template>
    <modal v-if="show" @close="$parent.showModalMessage = false" confirmText="Send">
        <h3 slot="header">New Message</h3>
        <div slot="body">
            <Edit :editing="false"></Edit>
        </div>
    </modal>
</template>
<script>
import Modal from './Modal.vue'
import Edit from '../../Messages/Edit.vue'

export default {
    components: {
        'modal': Modal,
        'Edit': Edit
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    }
}
</script>
