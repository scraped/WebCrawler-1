<template>
    <transition name="slide">
        <div class="agenda" v-if="visible" @click.stop>
            <div class="agenda-header">
                <div class="agenda-year">
                    {{year}}
                </div>
                <div class="agenda-date">
                    {{date_formatted}}
                </div>
            </div>
            <div class="agenda-controls">
                <div class="agenda-controls-month">
                    {{month.getFormatted()}}
                </div>
                <button class="agenda-controls-next" @click="nextMonth()">
                    <svg viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
                    </svg>
                </button>
                <button class="agenda-controls-prev" @click="prevMonth()">
                    <svg viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
                    </svg>
                </button>
            </div>
            <div class="agenda-week">
                <div v-for="day in days" track-by="$index" class="week-day">
                    {{day}}
                </div>
            </div>
            <div class="agenda-days">
                <div class="agenda-day" v-bind:style="{width: (month.getWeekStart() * 41) + 'px'}"></div>
                <div class="agenda-day" @click="selectDate(day)" v-for="day in month.getDays()" :class="{selected: isSelected(day)}">
                    <span class="agenda-day-effect"></span>
                    <span class="agenda-day-text">{{day.format('D')}}</span>
                </div>
            </div>
            <div class="agenda-actions">
                <button @click="cancel()">Annuler</button>
                <button @click="submit()">Ok</button>
            </div>
        </div>
    </transition>
</template>
<style lang="sass">
$header-height: 100px;
$day-size: 41px;

.agenda {
    position: absolute;
    top: 34px;
    width: 315px;
    z-index: 5;
    background: #fff;
    box-shadow:
        0 14px 45px rgba(0,0,0,0.25),
        0 10px 18px rgba(0,0,0,0.22);
}

.agenda-header {
    background: #1ab394;
    color: white;
    padding: 20px;
    height: $header-height;
}

.agenda-year {
    opacity: 0.7;
    margin-bottom: 10px;
}

.agenda-date {
    font-size: 30px;
    line-height: 16px;
}

.agenda-week {
    padding: 0 14px;
    font-size: 12px;
    line-height: 12px;
    color: rgba(0,0,0,0.8);
}

.week-day {
    float: left;
    width: $day-size;
    text-align: center;
}

.agenda-days {
    margin: 14px 14px 0;
    height: $day-size * 5;
}

.agenda-day {
    position: relative;
    width: $day-size;
    height: $day-size;
    float: left;
    text-align: center;
    line-height: $day-size;
    cursor: pointer;
    transition: color .3s;
}

.agenda-day-text {
    position: relative
}

.agenda-day:hover {
    color: white;
    .agenda-day-effect {
        transform: scale(1);
        opacity: 0.6
    }
}

.agenda-day.selected {
    color: white;
    .agenda-day-effect {
        transform: scale(1);
        opacity: 1
    }
}

.agenda-day-effect {
    position: absolute;
    background-color: #1ab394;
    transform: scale(0);
    transition: all .3s;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    top: 3px;
    left: 3px;
}

.agenda-controls {
    position: relative;
    height: 56px;
    line-height: 56px;
    text-align: center;

    button {
        position: relative;
        border: none;
        background-color: transparent;
        user-select: none;
        outline: none;
        cursor: pointer;
        height: 56px;
        width: 56px;
    }

    svg {
        width: 24px;
        height: 24px;
        fill: rgba(0,0,0,0.87);
        vertical-align: middle;
    }
}

.agenda-controls-month {

    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.agenda-controls-next {
    float: right
}
.agenda-controls-prev {
    float: left
}
.agenda-actions {
    text-align: right;
    padding: 8px;
}

.agenda-actions button {
    border: none;
    background-color: transparent;
    display: inline-block;
    cursor: pointer;
    outline: none;
    color: #1ab394;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 500;
    min-width: 88px;
    line-height: 36px;
    text-align: center;
    -webkit-appearance: none;
    transition: all .3s;
    &:hover{
        background-color: rgba(153,153,153,.20);
    }
}

.slide-enter-active, .slide-leave-active {
    transition: opacity .2s
}
.slide-enter, .slide-leave-active {
    opacity: 0;
}

</style>
<script>
import Month from './month'
import bus    from '../../../bus'
export default {
    props: {
        date: null,
        name: {},
        visible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            days: ['L','M','M','J','V','S','D'],
            month: new Month(new Date(this.date))
        }
    },
    methods: {
        isSelected(day) {
            return this.date.unix() === day.unix()
        },
        selectDate(day) {
            this.date = day.clone()
        },
        nextMonth() {
            let month = this.month.month + 1;
            let year = this.month.year;

            if(month > 11) {
                year += 1;
                month = 0;
            }

            this.month = new Month(new Date(year, month))
        },
        prevMonth() {
            let month = this.month.month - 1;
            let year = this.month.year;

            if(month < 0) {
                year -= 1;
                month = 11;
            }

            this.month = new Month(new Date(year, month))
        },
        cancel() {
            bus.$emit('cancel', {
                name: this.name
            });
        },
        submit: function() {
            bus.$emit('change', {
                name: this.name,
                date: this.date
            });
        }
    },
    computed: {
        year() {
            return this.date.format('YYYY')
        },
        date_formatted() {
            return this.date.format('dddd D MMM')
        }
    }
}
</script>
