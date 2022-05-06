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
    <av-dialog
    variant="dark"
    :title="title"
    :cancelBtnText="'i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_CANCEL_BUTTON'"
    :okBtnText="'i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_OK_BUTTON'"
    @submit="okBtnTextCallback(choice)"
    :closeOnSubmit="closeOnSubmit"
    @close="cancelBtnCallback()"
    >

    <div class="ml-8" v-html="'i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_DEFAULT_MESSAGE'"></div>
    <div class="ml-8">
      <v-radio-group v-model="choice" mandatory class="existing-radiogroup">
        <v-radio key="unit" value="unit" :label="unitMessage()"></v-radio>
        <v-radio key="all" value="all" :label="allMessage()"></v-radio>
      </v-radio-group>
    </div>
    </av-dialog>
</template>

<script>
import AvDialog from "../../utils/AvDialog";
import i18n from '../../MessageFrench';

export default {
  name: "OccurrenceEventDialog",
  components: { AvDialog},

  props: {
    display: {
        type: Boolean,
        default: false
    },
    closeOnSubmit: {
        type: Boolean,
        default: true
    },
    cancelBtnCallback: {
        type: Function
    },
    okBtnTextCallback: {
        type: Function
    },
    title: {
        type: String
    },
  },
  data() {
    return {
      i18n: i18n,
      choice: null,
      submitFunction: ()=> {},
      occurrenceModal: true,
    }
  },

  methods: {
      unitMessage() {
          let text = "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_UNIT" + ' (' + "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_UNIT_DESC" +")"
          return text;
        },
        allMessage() {
            let text = "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_ALL" + ' (' + "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_ALL_DESC" +")"
            return text;
          },
  },

  mounted() {
      window.VEvent.listen('open-occurrence-dialog', (submitFunction) => {
          this.submitFunction = submitFunction
          this.occurrenceModal = true
      this.dialog = true
    })
  }
}
</script>
