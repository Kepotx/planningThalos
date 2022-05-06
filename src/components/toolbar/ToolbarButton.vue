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
 <v-btn v-if="$vuetify.breakpoint.mdAndUp && userRights.canCreateEvent && (userRights.canHandleResource || !resourceMode)" class="ametys-dropdown-invoker mr-3" x-large depressed color="rgba(149,117,205,0.2)" v-ripple="{ class: 'primary--text' }" @click="openEventDialog">
    <div class="d-flex align-center primary--text">
      <v-icon class="mr-3" size="18"> fa fa-plus </v-icon>
      {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_NEW}}
    </div>
  </v-btn>
</template>

<script>
import {  mapState } from 'vuex';
import i18n from '../MessageFrench';

export default {
  name: 'ToolbarButton',
  computed: {
    ...mapState({
      userRights: (state) => state.userRights.rights,
    }),
  },

  methods: {
    openEventDialog() {
      window.VEvent.fire('open-event-dialog');
    },

    changeMode(resourceMode) {
        this.resourceMode = resourceMode == "resourceTimelineDay";
    }
  },
  data() {
      return {
        i18n,
        resourceMode: false,
      }
    },
    mounted() {
        window.VEvent.listen('change-calendar-type', this.changeMode)
    }
};
</script>
