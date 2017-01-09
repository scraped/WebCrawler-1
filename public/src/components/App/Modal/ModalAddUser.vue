<template>
    <modal v-if="show" @close="$parent.showModalAddUser = false" confirmText="Create">
        <h3 slot="header">Add new User</h3>
        <div slot="body">
            <Edit :editing="false"></Edit>
        </div>
    </modal>
</template>
<script>
import Modal from './Modal.vue'
import Edit from '../../Users/back/Edit.vue'

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
