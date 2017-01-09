<template>
    <div class="row">
        <div class="col-md-12">
            <div class="row">
                <div class="col-md-12">

                    <ul class="nav nav-pills nav-justified" role="tablist">
                        <li role="presentation" class="active"><a href="#informations" aria-controls="informations" role="tab" data-toggle="tab">Informations</a></li>
                        <li role="presentation"><a href="#address" aria-controls="address" role="tab" data-toggle="tab">Address</a></li>
                        <li role="presentation"><a href="#options" aria-controls="options" role="tab" data-toggle="tab">Options</a></li>
                    </ul>
                    <br>
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="informations">
                            <div class="row">
                                <div class="form-group" key="avatar">
                                    <div class="col-md-2">
                                        <label for="inputAvatar">Avatar</label>
                                    </div>
                                    <div class="col-md-10">
                                        <div class="fileinput fileinput-new input-group" data-provides="fileinput">
                                            <div class="form-control" data-trigger="fileinput">
                                                <i class="glyphicon glyphicon-file fileinput-exists" style="float:left"></i>
                                                <span class="fileinput-filename truncate"></span>
                                            </div>
                                            <span class="input-group-addon btn btn-default btn-file">
                                    <span class="fileinput-new">Select file</span>
                                    <span class="fileinput-exists">Change</span>
                                    <input type="file" id="inputAvatar" name="...">
                                </span>
                                            <a href="#" class="input-group-addon btn btn-default fileinput-exists" data-dismiss="fileinput">Remove</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group" key="biography">
                                    <div class="col-md-2">
                                        <label for="inputBiography">Biography</label>
                                    </div>
                                    <div class="col-md-10">
                                        <textarea class="form-control" v-model="edited.biography" id="inputBiography" rows="3" placeholder="Biography"></textarea>
                                    </div>
                                </div>
                                <div class="form-group" key="firstname">
                                    <div class="col-md-2">
                                        <label for="inputFirstname">Firstname</label>
                                    </div>
                                    <div class="col-md-10">
                                        <input type="text" v-model="edited.firstname" class="form-control" id="inputFirstname" placeholder="Firstname">
                                    </div>
                                </div>
                                <div class="form-group" key="lastname">
                                    <div class="col-md-2">
                                        <label for="inputLastname">Lastname</label>
                                    </div>
                                    <div class="col-md-10">
                                        <input type="text" v-model="edited.lastname" class="form-control" id="inputLastname" placeholder="Lastname">
                                    </div>
                                </div>
                                <div class="form-group" key="email">
                                    <div class="col-md-2">
                                        <label for="inputEmail">Email</label>
                                    </div>
                                    <div class="col-md-10">
                                        <input type="email" v-model="edited.email" class="form-control" id="inputEmail" placeholder="Email">
                                    </div>
                                </div>
                                <div class="form-group" key="birthdate">
                                    <div class="col-md-2">
                                        <label>
                                            <div>Birthdate</div>
                                        </label>
                                    </div>
                                    <div class="col-md-10">
                                        <Datepicker :value="edited.birthdate" name="birthdate_edit" v-if="edited.birthdate && editing"></Datepicker>
                                        <Datepicker :value="today" name="birthdate_create" v-if="!editing"></Datepicker>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="address">
                            <div class="row">
                                <div class="form-group">
                                    <label class="col-sm-2 control-label" for="inputRoadNumber">Address</label>
                                    <div class="col-sm-3">
                                        <input type="text" placeholder="N°" v-model="edited.road_number" id="inputRoadNumber" class="form-control">
                                    </div>

                                    <div class="col-sm-7">
                                        <input type="text" placeholder="Street" id="inputStreet" v-model="edited.road_name" class="form-control">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-sm-2 control-label" for="inputCity">City</label>
                                    <div class="col-sm-6">
                                        <input type="text" placeholder="City" v-model="edited.city" id="inputCity" class="form-control">
                                    </div>

                                    <div class="col-sm-4">
                                        <input type="text" placeholder="Postal Code" id="inputPostalCode" v-model="edited.postal_code" class="form-control">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-2 control-label" for="inputCountry">Country</label>
                                    <div class="col-sm-10">
                                        <input type="text" placeholder="Country" id="inputCountry" v-model="edited.country" class="form-control">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="options">
                            <div class="row">
                                <div class="form-group" key="role">
                                    <div class="col-md-2">
                                        <label for="inputRole">Role</label>
                                    </div>
                                    <div class="col-md-10">
                                        <select id="inputRole" class="form-control" v-model="edited.role">
                                            <option v-for="role in roles" v-bind:value="role.name">
                                                {{ role.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group" key="activated">
                                    <div class="col-md-2">
                                        <label>Activated</label>
                                    </div>
                                    <div class="col-md-10">
                                        <div class="switch">
                                            <div class="onoffswitch">
                                                <input type="checkbox" class="onoffswitch-checkbox" v-model="edited.activated" id="activated">
                                                <label class="onoffswitch-label" for="activated">
                                                    <span class="onoffswitch-inner"></span>
                                                    <span class="onoffswitch-switch"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="btn-group btn-group-justified" role="group" key="activated" v-show="editing">
                        <div class="btn-group" role="button">
                            <button type="button" class="btn btn-default btn-sm">
                                <i class="fa fa-times"></i> Delete
                            </button>
                        </div>
                        <div class="btn-group" role="button">
                            <button type="button" class="btn btn-primary btn-sm" @click="save()">
                                <i class="fa fa-save"></i> Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
import moment from 'moment'
import Datepicker from '../../App/Datepicker/Datepicker.vue'
import { mapGetters, mapActions } from 'vuex'
export default{
    components: {
        Datepicker
    },
    computed: {
        ...mapGetters({
            user: 'user'
        })
    },
    created() {
        if(!this.editing)
            this.$store.dispatch('clearEdited');
        else
        {
            let u = this.user;
            this.edited = u;
        }

        $(function() {
            $('.fileinput').fileinput()
        });
    },
    methods:{
        ...mapActions({
            saveUser: 'saveUser',
            setUsers: 'setUsers'
        }),
        save() {
            this.$store.dispatch('setBirthdate', $('input[name=birthdate_edit]').val());
            this.$store.dispatch('saveUser', this.edited);
            this.$store.dispatch('setUsers', this.$parent);
        }
    },
    props: {
        editing: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            today: moment(new Date()).format('YYYY-MM-DD'),
            created: {},
            edited: {},
            roles: [
                {name: 'user', selected: true},
                {name: 'admin', selected: false}
            ]
        }
    }
}
</script>
