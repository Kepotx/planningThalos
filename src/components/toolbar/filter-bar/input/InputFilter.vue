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
  <!-- Input -->
  <v-text-field
      v-model="byName"
      readonly
      height="52"
      class="rounded-0 ametys-toolbar-input"
      hide-details
      flat
      background-color="rgba(149,117,205,0.1)"
      solo
      :label="label"
  ></v-text-field>
  <!-- End Input -->
</template>

<script>
import {mapGetters} from 'vuex'
import i18n from '../../../MessageFrench';

  export default {
    name: "InputFilter",
    computed: {
      byName: {
        get () {
          return this.$store.state.filters.byName
        },
        set (newValue) {
          this.$emit('searched',newValue)
          return this.$store.dispatch('filters/setByName', newValue)
        }
      },
      ...mapGetters({
        calendarType: 'calendars/getCalendarType',
        isFilterByCategory: 'filters/isFilterByCategory',
        isResourceCalendar: 'filters/isResourceCalendar',
      }),
      label(){
        return this.isFilterByCategory || this.isResourceCalendar ? '' : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_FILTER_TEXT
      },
    },
    data() {
        return {
          i18n
        }
      }
  }
</script>

<style lang="scss">
  .ametys-toolbar-input {
    input {
      color: #9575CD !important;
      font-weight: 500;
      cursor: pointer;
    }

    .v-label {
      color: rgba(149, 117, 205, 0.69);
      font-weight: 500;
    }

    .v-input__icon--prepend-inner {
      margin: 0 8px;

      i {
        font-size: 28px;
        color: #9575CD;
      }
    }
  }
</style>
