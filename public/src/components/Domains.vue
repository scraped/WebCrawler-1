<template>
    <div>
        <h1 class="page-header">Domains</h1>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Url</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="domain in domains">
                    <td>{{domain.id}}</td>
                    <td class="truncate"><a :href="domain.url" target="_blank">{{domain.url}}</a></td>
                    <td><timeago :since="domain.createdAt"></timeago></td>
                    <td><timeago :since="domain.updatedAt"></timeago></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default
{
    name: 'Domains',
    computed: mapGetters({
        domains: 'domains'
    }),
    created () {
        this.$store.dispatch('setDomains')
    }
}
</script>
