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
  <v-col cols="12"
         md="12"
         lg="3"
         order="2"
        :class="{'flex-fill-max order-3': $vuetify.breakpoint.width >= 958 && $vuetify.breakpoint.width <= 1183}"

  >
    <v-card class="rounded-lg pa-2" flat>
      <!-- Title -->
      <v-card-title class="d-flex justify-space-between primary--text text-subtitle-1 font-weight-medium">
        <span class="d-none d-lg-block">Prochains évènements</span>

      </v-card-title>
      <!-- End Title -->

      <v-card-text>
        <!-- Events -->
        <event-card v-for="event in events"
                    :key="event.id"
                    :event="event"
        ></event-card>
        <!-- End Events -->

        <!-- Empty Message -->
        <span v-if="!events.length"
              v-text="'Aucun évènement n\'a été trouvé'"
        ></span>
        <!-- End Empty Message -->
      </v-card-text>

      <!-- Paremetrs -->
      <v-card-text>
        <event-parameters></event-parameters>
      </v-card-text>
      <!-- End Paremetrs -->
    </v-card>
  </v-col>
</template>

<script>
  import {mapGetters} from 'vuex';
  import EventCard from './EventCard';
  import EventParameters from './EventParameters';
  import i18n from '../../MessageFrench';
  export default {
    name: "EventContainer",
    components: {EventParameters, EventCard},
    computed: {
      ...mapGetters({
        events: 'events/getAsideEvents',
        isFilterByCategory: 'filters/isFilterByCategory',
        calendarType: 'calendars/getCalendarType'
      })

    },
    data() {
      return {
        i18n
      }
    }
  }
</script>
