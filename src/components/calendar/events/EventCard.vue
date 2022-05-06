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
  <div @click="focusEvent"
       class="mb-5">
    <v-card class="event"
            :data-event-card-id="event.id"
    >
      <v-card-text>
        <div class="event-details">
          <!-- Date Range -->
          <div class="d-flex event-detail-space-left">
            <v-icon
                class="mr-2"
                size="12"
            >
              fas fa-calendar
            </v-icon>
            <span class="text-caption"
                  v-text="getRangeTime(event)"
            ></span>
          </div>
          <!-- End Date Range -->

          <div class="d-flex align-center">
            <!-- Day -->
            <div class="text-center black--text px-5">
              <div class="font-weight-light text-h5"
                   v-text="getDayNumber(event.start)"
              ></div>
              <div class="text-uppercase font-weight-semi-bold"
                   v-text="getShortMonth(event.start)"
              ></div>
            </div>
            <!-- End Day -->
            <!-- Colored Divider -->
            <event-title-divider :color="event.color ? event.color : '#909090'"></event-title-divider>
            <!-- Colored Divider -->
            <!-- Title -->
            <h4 class="pl-2 my-2">
                <span class="text-subtitle-2 grey--text text--darken-3 ametys-truncate-2"
                    :data-ametys-tooltip="event.title"
                    v-html="event.title"/>
            </h4>
            <!-- End Title -->
          </div>

          <!-- Location -->
          <div v-if="event.geolocation"
               class="d-flex event-detail-space-left"
          >
            <v-icon
                class="mr-2"
                size="12"
            >
              fa fa-map-marker
            </v-icon>
            <span
                class="text-caption"
                v-text="event.geolocation"
            ></span>
          </div>
          <!-- End Location -->
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import EventTitleDivider from './EventTitleDivider';
import i18n from '../../MessageFrench';
import moment from 'moment-timezone';

export default {
  name: "EventCard",
  components: {EventTitleDivider},
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
      return {
        i18n: i18n,
          waitForServer: false,
      }
  },
  methods: {
    focusEvent() {
      window.FullCalendarAPI.gotoDate(this.event.start)
      const event = window.FullCalendarAPI.getEventById(this.event.id);

      if (event)
      {
          this.focusLoadedEvent();
      }
      else
      {
          // Appel serveur
          this.waitForServer = true;
      }
    },

    eventsLoaded() {
        if (this.waitForServer)
        {
            this.waitForServer = false;
            let that = this;
            window.setTimeout(function() {
                that.focusLoadedEvent();
            }, 1);
        }
    },

    focusLoadedEvent() {
        const event = window.FullCalendarAPI.getEventById(this.event.id);
        const eventElements = document.querySelectorAll(`[data-id="${this.event.id}"]`)
        var eventElement = eventElements[0];

        var eventRect = eventElement.getBoundingClientRect();

        // Scroll only if the event is not on the screen.
        // Subtract 100 pixels so event container is neither hidden nor stick to the header
        if ((eventRect.top - 100)  < 0)
        {
            window.scrollBy(0, eventRect.top - 100)
        }
        // Also check if the event is not on the bottom of the screen
        else if (eventRect.bottom > window.innerHeight)
        {
            window.scrollBy(0, eventRect.bottom)
        }

        window.VEvent.fire('open-event-details', {el: eventElement, event: event,clickType:'fromEventCard'})

    },

    getRangeTime({start, end})
    {
        const startDay = this.getDayNumber(start)
        const endDay = this.getDayNumber(end)
        var time;

        if (this.event.allDay)
        {
            time = "Toute la journée";
            if (startDay !== endDay)
            {
                time = `${time} jusqu'au ${endDay} ${this.getShortMonth(end)}`
            }
        }
        else
        {
            time = moment(start).locale(i18n.PLUGINS_WORKSPACES_LANGUAGE_CODE).format('LT') + ' ' + i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_TO + ' ' + moment(end).locale(i18n.PLUGINS_WORKSPACES_LANGUAGE_CODE).format('LT')
            if (startDay !== endDay)
            {
                time = `${time} ${i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_THE} ${endDay} ${this.getShortMonth(end)}`
            }
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
  },

  mounted() {
      window.VEvent.listen('events-loaded', this.eventsLoaded);
  },

}
</script>

<style scoped lang="scss">
.event {
  box-shadow: 0 2px 22px 0 rgba(0, 0, 0, 0.05) !important;
  transition: .4s;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0 !important;
  }

  &:hover {
    box-shadow: 0 2px 22px 0 #cfcfcf !important;
  }

  &.active {
    background-color: rgba(#9575cd, .1);
  }
}

.event-details {
  span {
    color: #7F8182;
  }

  i {
    opacity: .7;
  }

  .event-detail-space-left {
    padding-left: 80px;
  }
}

$dateWidth: 80px;

.event-details .text-center {
    width: $dateWidth;
    min-width: $dateWidth;
    max-width: $dateWidth;
}

.event-details h4 {
    width: calc(100% - #{$dateWidth});
}
</style>
