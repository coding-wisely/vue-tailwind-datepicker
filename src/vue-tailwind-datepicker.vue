<template>
    <div :class="pickerWrapperClasses">
        <label>
            <input
                    :class="inputFieldClasses"
                    @click="showCalendar"
                    placeholder="Date"
                    type="text"
                    v-model="selectedDate"
            />
        </label>
        <transition name="slide">
            <div
                    :class="[hideCalendar ? 'hidden' : 'open' , calendarWrapperClasses]"
                    v-if="!hideCalendar"
            >
                <div :class="pickerMonthSelectionClasses">
                    <span role="button">
                      <svg @click="subtractMonth" class="svg-icon">
                        <path
                                d="M8.388 10.049l4.76-4.873a.783.783 0 00-1.117-1.093L6.726 9.516a.78.78 0 00.012 1.105l5.433 5.307a.784.784 0 001.106-.013.78.78 0 00-.012-1.104l-4.877-4.762z"
                                fill="none"
                        />
                      </svg>
                    </span>
                    <div>{{month + ' ' + year}}</div>
                    <svg @click="addMonth" class="svg-icon" role="button">
                        <path
                                d="M11.611,10.049l-4.76-4.873c-0.303-0.31-0.297-0.804,0.012-1.105c0.309-0.304,0.803-0.293,1.105,0.012l5.306,5.433c0.304,0.31,0.296,0.805-0.012,1.105L7.83,15.928c-0.152,0.148-0.35,0.223-0.547,0.223c-0.203,0-0.406-0.08-0.559-0.236c-0.303-0.309-0.295-0.803,0.012-1.104L11.611,10.049z"
                                fill="none"
                        />
                    </svg>
                </div>
                <div :class="pickerDaysHeaderClasses">
                    <div
                            :key="'day-' + index + '-' + day"
                            class="calendar-day-box"
                            v-for="(day, index) in days"
                    >{{ day }}
                    </div>
                </div>
                <div :class="calendarWrapperClasses">
                    <div
                            :key="'day-' + blank + '-' + index"
                            class="calendar-day-box"
                            v-for="(blank, index) in firstDayOfMonth"
                    ></div>
                    <div
                            :class="[[index === activeIndex ?selectedDayClasses:(date === initialDate && month === initialMonth && year === initialYear) ? currentDayClasses :  '']] "
                            :key="'day-' + index "
                            class="calendar-day-box text-center"
                            v-for="(date, index) in daysInMonth"
                    >
            <span
                    :class="[index === activeIndex ?selectedDayClasses:''] "
                    @click="selectDay($event, index)"
                    ref="day"
                    role="button"
            >{{ date }}</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'tailwind-vue-datepicker',
    data () {
      return {
        hideCalendar: true,
        today: moment(),
        dateContext: moment(),
        days: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        activeIndex: null,
        selectedDate: moment().format(this.dateFormat)
      }
    },
    methods: {
      selectDay (event, index) {
        this.activeIndex = index
        let target = event.target.innerHTML
        this.selectedDate = this.formatSelectedDate(target)
        this.$emit('input', this.selectedDate)
        if(this.closeOnClick){
          this.hideCalendar = true;
        }
      },
      formatSelectedDate (target) {
        let day = target ? target : this.currentDate

        let month = moment()
        .month(this.month)
        .format('MM')
        let year = moment()
        .year(this.year)
        .format('YYYY')
        let str = moment(
          year + '-' + month + '-' + day,
          this.dateFormat,
          false
        ).format()
        let selected = moment(str).utcOffset(str)
        return selected.format(this.dateFormat)
      },
      showCalendar () {
        return (this.hideCalendar = !this.hideCalendar)
      },
      addMonth () {
        this.dateContext = moment(this.dateContext).add(1, 'month')
      },
      subtractMonth () {
        this.dateContext = moment(this.dateContext).subtract(1, 'month')
      }
    },
    computed: {
      year () {
        return this.dateContext.format('Y')
      },
      month () {
        return this.dateContext.format('MMMM')
      },
      daysInMonth () {
        return this.dateContext.daysInMonth()
      },
      currentDate () {
        return this.dateContext.get('date')
      },
      firstDayOfMonth () {
        let firstDay = moment(this.dateContext).subtract(
          this.currentDate - 1,
          'days'
        )
        return firstDay.weekday()
      },
      initialDate () {
        return this.today.get('date')
      },
      initialMonth () {
        return this.today.format('MMMM')
      },
      initialYear: function () {
        return this.today.format('Y')
      }
    },
    mounted() {
      if (this.value.length > 0) {
        this.selectedDate = this.value;
        this.dateContext = moment(this.value);
      }
    },
    props: {
      pickerWrapperClasses: {
        type: String,
        default: 'w-64'
      },
      inputFieldClasses: {
        type: String,
        default:
          'focus:outline-none cursor-pointer  w-full bg-white h-12 p-3 border-b border-purple-300 text-lg font-medium text-gray-700'
      },
      pickerMonthSelectionClasses: {
        type: String,
        default: 'flex justify-between h-12 w-full p-2 items-center bg-purple-100 uppercase'
      },
      pickerDaysHeaderClasses: {
        type: String,
        default: 'flex w-full w-full justify-start text-center p-2'
      },
      calendarWrapperClasses: {
        type: String,
        default: 'flex w-full border-l border-r border-b border-purple-100 justify-start text-center flex-wrap'
      },
      selectedDayClasses: {
        type: String,
        default: 'bg-purple-500 text-white'
      },
      currentDayClasses: {
        type: String,
        default: 'bg-purple-300 text-white'
      },
      dateFormat: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      preselectedDay: {
        type: Number
      },
      closeOnClick: {
        type: Boolean,
        default: true
      },
      value: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped>

    .calendar-day-box {
        width: 13.3%;
    }

    .svg-icon {
        width: 1em;
        height: 1em;
    }

    .svg-icon path,
    .svg-icon polygon,
    .svg-icon rect {
        fill: #4691f6;
    }

    .svg-icon circle {
        stroke: #4691f6;
        stroke-width: 1;
    }

    .slide-leave-active,
    .slide-enter-active {
        transition: 1s;
    }

    .slide-enter {
        transform: translate(-100%, 0);
    }

    .slide-leave-to {
        transform: translate(-100%, 0);
    }

    .open {
        left: 0;
        transition: all 0.3s ease;
    }
</style>
