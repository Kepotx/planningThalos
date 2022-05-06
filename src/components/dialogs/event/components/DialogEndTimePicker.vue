/*
 *  Copyright 2022 Anyware Services
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
<template>

  <v-menu offset-y
          max-height="150"
          nudge-bottom="2"
          v-model="menu"
          :content-class="`${uuid}_time__picker`"
          @input="handleVMenuToggle"

  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          v-model="time"
          hide-details
          v-bind="attrs"
          v-on="on"
          @keyup.enter="onKeyUp"
          @blur="onBlur"
          :rules="rules"
      ></v-text-field>
    </template>
    <v-list>
      <v-list-item
          color="primary"
          v-for="(item, index) in items"
          :key="index"
          link
          :id="uuid+item.time"
          @click="selectTime(item)"
          :class="{'v-list-item--active': item.time === time}"
      >
        <div class="d-flex align-center filter-bar-item-font">
          <div class="mr-1">{{ item.time }}</div>
          <span v-if="!isAfter()">({{ timeDiff(item) }})</span>
        </div>
      </v-list-item>
      <v-list-item
          color="primary"
          link
          @click="setNextDay"
          v-if="!nextDay">
          <div class="d-flex align-center filter-bar-item-font">
              {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_NEXT_DAY }}
          </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

import i18n from '../../../MessageFrench';
import moment from "moment";

export default {
  ne: "DialogTimePicker",

  props: {
    value: {
      type: Object
    },
    startTime: {
      required: true,
      type: String
    },
    startDate: {
      required: true,
      type: String
    },
    endDate: {
      required: true,
      type: String
    },
    rules: {
        type: Object
      },
  },

  computed: {
    items() {
      let time = []

      for (let i = 0; i < 1440; i += 30) {
        const date = moment(moment(this.startDate).format('YYYY-MM-DD') + 'T' + (this.nextDay ? '00:00' : this.startTime)).add(i, 'minutes')

        time.push({
          time: date.format('HH:mm'),
          date: date
        })
      }

      return time
    },
    isInvalid() {
      return moment(this.endLocalDate).isAfter(moment(this.endDate + 'T' + moment(this.endLocalDate).format('HH:mm')))
    }
  },

  data() {
    return {
      endLocalDate: '',
      date: '',
      time: this.value.value,
      menu: false,
      nextDay: false,
      uuid:'_' + Math.random().toString(36).substr(2, 9),
      i18n
    }
  },

  methods: {
    handleVMenuToggle(v){
      if(v){

          /* FIXME fix $/jquery to scrolltop
        setTimeout(() => {
          const content = $(`.${this.uuid}_time__picker`)
          var computedHour;
          for (var i = 0; i < this.items.length; i++) {
              var item = this.items[i]
              if (moment(item.time, "HH:mm").isSameOrBefore(moment(this.value.value, "HH:mm")))
              {
                  computedHour = item.time;
              }
              else
              {
                  break;
              }
            }

          const computedItem = $("[id='" + this.uuid + computedHour + "']")
          if(computedItem.length != 0 && content.length != 0){
            content[0].scrollTop =  computedItem[0].offsetTop;

          }
        }, 100);
        */
      }
    },
    setNextDay() {
      this.selectTime({
        time: moment(moment(this.startDate).format('YYYY-MM-DD')).add(1, 'days').format('HH:mm'),
        date: moment(moment(this.startDate).format('YYYY-MM-DD')).add(1, 'days')
      })

      setTimeout(() => this.nextDay = true)
    },

    isAfter() {
      return moment(this.endDate).isAfter(moment(this.startDate)) || moment(this.startTime, 'HH:mm').isAfter(moment(this.time, 'HH:mm'));
    },

    timeDiff(item) {
      let diffMinutes = moment(this.startDate + 'T' + this.startTime).diff(item.date, 'minutes'),
          diffHours = moment(this.startDate + 'T' + this.startTime).diff(item.date, 'hours')

      if (diffHours)
      {
        const hr = Math.abs(diffHours) + (((diffMinutes / 2) % 2 !== 0) ? (i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_SEPARATOR + '5') : '')
        return hr + (hr == 1 ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_HOUR : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_HOURS)
      }
      else
      {
        return Math.abs(diffMinutes) + i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_MIN
      }
    },

    selectTime(val = {}) {
      const regex = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
      let vad = Object.assign({}, val)

      if (regex.test(this.time)) {

        if (Object.prototype.hasOwnProperty.call(val, 'time')) {
          this.time = vad.time
          this.endLocalDate = vad.date
        }

        this.emitChange()
        this.menu = false
      } else {
        this.time = this.value.value
      }
    },

    onBlur(e) {
      if (e.relatedTarget && !e.relatedTarget.closest('.v-list-item')) {
        this.onKeyUp()
      }
    },

    onKeyUp() {
      const start = Math.abs(moment(this.startDate + ' 00:00').diff(moment(this.startDate + ' ' + this.startTime), 'hours')),
          end = Math.abs(moment(this.startDate + ' 00:00').diff(moment(this.startDate + ' ' + this.time), 'hours'))

      if (start > end) {
        this.selectTime({
          time: this.time,
          date: moment(this.startDate).add(1, 'days')
        })
      } else {
        this.selectTime({
          time: this.time,
          date: moment(this.startDate)
        })
      }
    },

    emitChange() {
      if (this.isAfter() && moment(this.endDate).isSame(moment(this.startDate))) {
        this.$emit('setEndDate', moment(this.startDate).add(1, 'days').format('YYYY-MM-DD'))
      }

      this.$emit('change', {
        value: this.time
      })
      this.$emit('input', {
        value: this.time
      })
    }
  },

  watch: {
    endDate() {
        var startDate = moment(this.startDate + ' ' + this.startTime, 'YYYY-MM-DD HH:mm')
        var endDate = moment(this.endDate + ' ' + this.time, 'YYYY-MM-DD HH:mm')
        // If startDate + startTime < endDate + endTime

      if (startDate.isAfter(endDate))
      {
          this.time = moment(this.startDate + 'T' + this.startTime).add('hours', 1).format('HH:mm')
          this.emitChange()
      }

      if (this.nextDay) {
        this.nextDay = false
      }
    },

    menu(val) {
      if (val && this.isAfter()) {
        this.nextDay = true
      }
    },

    value: {
      deep: true,
      handler: function (val) {
        this.time = val.value;
      }
    },

    isInvalid(val) {
      if (val) {
        this.$emit('error')
      } else {
        this.$emit('success')
      }
    }
  }
}
</script>
