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
  <v-menu
      v-model="menu"
      :close-on-content-click="false"
      max-width="290"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
          :value="computedDateFormattedMomentjs"
          readonly
          v-bind="attrs"
          prepend-icon="mdi-calendar"
          :hide-details="hideDetails"
          :label="label"
          v-on="on"
          @click:clear="model = null"
          :error="error"
          :clearable="clearable"
          :rules="rules"
      ></v-text-field>
    </template>
    <v-date-picker
        v-model="model"
        @change="menu = false"
        :min="minDates"
        locale="fr"
    ></v-date-picker>
  </v-menu>
</template>
<!-- FIXME remettre ?
:picker-date.sync="model ? '' : minDates"-->
<script>

import moment from "moment";
import i18n from '../../../MessageFrench';

export default {
    name: "DialogDatePicker",

    props: {
      error: {
        type: Boolean,
        default: false
      },
      value: {
        type: String
      },
      label: {
        type: String
      },
      format: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      clearable: {
        type: Boolean,
        default: false
      },
      minDates: {
          type: String
        },
      rules: {
          type: Object
        },
        hideDetails: {
            type: Boolean,
            default: true
          },
    },

    data() {
      return {
        model: this.value,
        menu: false,
        displayDate: '',
        dateModel: '',
        timeModel: '',
        i18n
      }
    },

    computed: {
      computedDateFormattedMomentjs() {
        return this.model ? moment(this.model).locale(i18n.PLUGINS_WORKSPACES_LANGUAGE_CODE).format(i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_DAY_DATE_FORMAT) : ''
      }
    },

    watch: {
      value(val) {
        this.model = val
      },
      model(val, oldVal) {
          this.$emit('change', val, oldVal)
        this.$emit('input', val)
      }
    }
  }
</script>

<style scoped>
  .v-picker {
    height: 100%;
    border-radius: 0;
  }
</style>
