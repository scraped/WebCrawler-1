<template>
    <div class="datepicker_container">
        <div class='input-group date'>
            <input type="text" :name="name" :value="date_formatted" class="form-control" @click="show()">
            <input type="hidden" :name="name" :value="date_raw" class="form-control">

            <agenda v-bind:date="date" :name="name" @change="selectDate(date)" :visible="isVisible" @cancel="hide()"></agenda>

            <span class="input-group-addon" @click="show()">
                <span class="fa fa-calendar"></span>
            </span>
        </div>
    </div>
</template>
<style>
    .datepicker_container {
        position: relative
    }
</style>
<script>
import moment from 'moment'
import Agenda from './Agenda.vue'
import bus    from '../../../bus'
moment.locale('fr');

export default {
   props: {
       value: {
           type: String
       },
       format: {
           type: String,
           default: 'YYYY-MM-DD'
       },
       name: {
           type: String
       }
   },
    computed: {
        date_formatted() {
            return this.date.format(this.format)
        },
        date_raw() {
            return this.date.format('YYYY-MM-DD')
        }
    },
    methods: {
        show: function() {
            this.isVisible = true;
            setTimeout(() => {
                document.addEventListener('click', this.hide);
            }, 0)
        },
        hide: function() {
            this.isVisible = false;
            document.removeEventListener('click', this.hide)
        },
        selectDate: function(date) {
            this.date = date;
            this.hide()
        }
    },
    components: {
        agenda: Agenda
    },
    created() {
        bus.$on('change', (data) => {
            if(data.name == this.name)
                this.selectDate(data.date);
        });

        bus.$on('cancel', (data) => {
            if(data.name == this.name)
                this.hide();
        });

        if(typeof this.value !== 'undefined')
            this.date = moment(this.value, 'YYYY-MM-DD');
        else
            this.date = moment('YYYY-MM-DD');
    },
    data() {
       return {
           isVisible: false,
           date: null
       }
    }
}
</script>
