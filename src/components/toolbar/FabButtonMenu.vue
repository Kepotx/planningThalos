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
  <v-btn v-if="userRights.canCreateEvent && (userRights.canHandleResource || !resourceMode)" color="primary" dark bottom right fab fixed @click="openEventDialog">
      <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script>
import {mapState } from 'vuex';

export default {
  name: 'FabButtonMenu',
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
        resourceMode: false,
      }
    },
    mounted() {
        window.VEvent.listen('change-calendar-type', this.changeMode)
    }
};
</script>
