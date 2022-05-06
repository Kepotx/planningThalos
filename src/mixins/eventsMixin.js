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
import Debouncer from '../../_components/helper/Debouncer'
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      byCategory: (state) => state.filters.byCategory,
      byName: (state) => state.filters.byName,
      start: (state) => state.filters.start,
      end: (state) => state.filters.end,
      byResourceCalendar: (state) => state.filters.byResourceCalendar,
    }),
    ...mapGetters('calendars', {
      calendarType: 'getCalendarType',
    }),
  },

  created() {
    this.loadEvents = Debouncer((cb = null) => {
      const params = {
        start: this.start,
        end: this.end
      }

      this.$store.dispatch('events/loadEvents', params).finally(() => {
        if (cb) cb()
      })
    }, 400)
  },
}
