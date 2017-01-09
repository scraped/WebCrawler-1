<template>
    <modal v-if="show" @close="$parent.showModalEditUser = false" confirmText="Save">
        <h3 slot="header">Editing user</h3>
        <div slot="body">
            <Edit :editing="true"></Edit>
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
