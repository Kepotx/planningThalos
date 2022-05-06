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
          :content-class="`${uuid}_time__picker`"
          v-model="menu"
          @input="handleVMenuToggle"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          v-model="time"
          hide-details
          v-bind="attrs"
          :readonly="allDay"
          v-on="on"
          @keyup.enter="selectTime"
          @blur="onBlur"
      ></v-text-field>
    </template>
    <v-list>
      <v-list-item
          color="primary"
          link
          :class="{'v-list-item--active': allDay}"
          @click="setAllDay"
      >
        <div class="filter-bar-item-font">{{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_FULL_DAY }}</div>
      </v-list-item>
      <v-list-item
          color="primary"
          v-for="(item, index) in items"
          :key="index"
          link
          :id="uuid+item"
          @click="selectTime(item)"
          :class="{'v-list-item--active': item === time && !allDay}"
      >
        <div class="d-flex align-center filter-bar-item-font">
          <div class="mr-1">{{ item }}</div>
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

import i18n from '../../../MessageFrench';

export default {
  props: {
    value: {
      type: Object
    },

    allDay: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      time: this.value.value,
      menu: false,
      uuid:'_' + Math.random().toString(36).substr(2, 9),
      items: [
        "00:00",
        "00:15",
        "00:30",
        "00:45",
        "01:00",
        "01:15",
        "01:30",
        "01:45",
        "02:00",
        "02:15",
        "02:30",
        "02:45",
        "03:00",
        "03:15",
        "03:30",
        "03:45",
        "04:00",
        "04:15",
        "04:30",
        "04:45",
        "05:00",
        "05:15",
        "05:30",
        "05:45",
        "06:00",
        "06:15",
        "06:30",
        "06:45",
        "07:00",
        "07:15",
        "07:30",
        "07:45",
        "08:00",
        "08:15",
        "08:30",
        "08:45",
        "09:00",
        "09:15",
        "09:30",
        "09:45",
        "10:00",
        "10:15",
        "10:30",
        "10:45",
        "11:00",
        "11:15",
        "11:30",
        "11:45",
        "12:00",
        "12:15",
        "12:30",
        "12:45",
        "13:00",
        "13:15",
        "13:30",
        "13:45",
        "14:00",
        "14:15",
        "14:30",
        "14:45",
        "15:00",
        "15:15",
        "15:30",
        "15:45",
        "16:00",
        "16:15",
        "16:30",
        "16:45",
        "17:00",
        "17:15",
        "17:30",
        "17:45",
        "18:00",
        "18:15",
        "18:30",
        "18:45",
        "19:00",
        "19:15",
        "19:30",
        "19:45",
        "20:00",
        "20:15",
        "20:30",
        "20:45",
        "21:00",
        "21:15",
        "21:30",
        "21:45",
        "22:00",
        "22:15",
        "22:30",
        "22:45",
        "23:00",
        "23:15",
        "23:30",
        "23:45"
      ],
      i18n
    }
  },
  mounted() {
    if(this.allDay) this.time = i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_FULL_DAY
  },
  methods: {
    handleVMenuToggle(v){
      if(v){

                  /* FIXME fix $/jquery to scrolltop
        setTimeout(() => {
          const content = $(`.${this.uuid}_time__picker`)
          var computedHour = this.items.slice().reverse().find(item => moment(item, "HH:mm").isSameOrBefore(moment(this.value.value, "HH:mm")));

          const computedItem = $("[id='" + this.uuid + computedHour + "']")
          if(computedItem.length != 0 && content.length != 0){
            content[0].scrollTop =  computedItem[0].offsetTop;
          }
        }, 100);
        */
      }
    },
    setAllDay() {
      this.$emit('setAllDay', !this.allDay)

      if (!this.allDay) {
        this.time = i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_FULL_DAY
      } else {
        this.time = this.value.value
      }
    },

    selectTime(val = null) {
      const regex = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)

      if (regex.test(val)) {
        if (val && typeof val === 'string') {
          this.time = val
        }

        this.emitChange()
        this.menu = false
      } else if(this.time != this.value.value) {

          if(!regex.test(this.time))
          {
              this.time = this.value.value
          }
          this.emitChange()
          this.menu = false
      }

      this.$emit('setAllDay', false)
    },

    onBlur(e) {
      if (e.relatedTarget && !e.relatedTarget.closest('.v-list-item')) {
        this.selectTime()
      }
    },

    emitChange() {
      this.$emit('change', {value: this.time})
      this.$emit('input', {value: this.time})
    }
  },

  watch: {
    value: {
      deep: true,
      handler: function (val) {
        this.time = val.value

        if (this.allDay) {
          this.time = i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_FULL_DAY
        }
      }
    },

    allDay(val) {
      if (!val && this.time === i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_FULL_DAY) {
        this.time = this.value.value
      }
    }
  }
}
</script>

<style scoped>

</style>
