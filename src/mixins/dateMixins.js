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
import moment from 'moment';
import i18n from 'i18n';

export default {

  data() {
    return {
      i18n
    }
  },
    
  methods: {
    getRangeTime({start, end}) {
      if (this.event.allDay) {
        return i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DATEPICKER_FULL_DAY
      }

      var time = moment(start).locale(i18n.PLUGINS_WORKSPACES_LANGUAGE_CODE).format('LT') + ' ' + i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_TO + ' ' + moment(end).locale(i18n.PLUGINS_WORKSPACES_LANGUAGE_CODE).format('LT')
      const startDay = this.getDayNumber(start)
      const endDay = this.getDayNumber(end)

      if (startDay !== endDay) {
        time = `${time} ${i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_THE} ${endDay} ${this.getShortMonth(end)}`
      }

      return time
    },
    getDayNumber(startDate) {
      return moment(startDate).format('DD')
    },
    getShortMonth(startDate) {
      const month = moment(startDate).locale(i18n.PLUGINS_WORKSPACES_LANGUAGE_CODE).format('MMM')
      return month.indexOf('.') !== -1 ? month.slice(0, month.length -1) : month
    }
  }
}