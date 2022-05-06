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
  <v-col md="12"
         lg="9"
         order="1"
         order-md="2"
        :class="{'flex-fill-max': $vuetify.breakpoint.width >= 958 && $vuetify.breakpoint.width <= 1183}"
  >
    <v-card class="rounded-lg" flat :class="FullCalendarAPI ? FullCalendarAPI.view.type : null">
      <v-card-text>
        <div class="fc fc-direction-ltr">
          <div class="fc-header-toolbar fc-toolbar fc-toolbar-ltr"
               :class="{'d-flex justify-content-between mt-5': !$vuetify.breakpoint.mdAndUp}">
            <button v-if="!$vuetify.breakpoint.mdAndUp" @click="FullCalendarAPI.prev()"
                    class="fc-prev-button fc-button fc-button-primary" type="button" aria-label="prev"><span
                class="fc-icon fc-icon-chevron-left"></span></button>

            <div class="fc-toolbar-chunk" v-if="$vuetify.breakpoint.mdAndUp">
              <div class="fc-button-group">
                <button @click="FullCalendarAPI.prev()" class="fc-prev-button fc-button fc-button-primary" type="button"
                        aria-label="prev"><span
                    class="fc-icon fc-icon-chevron-left"></span></button>
                <button @click="FullCalendarAPI.next()" class="fc-next-button fc-button fc-button-primary" type="button"
                        aria-label="next"><span
                    class="fc-icon fc-icon-chevron-right"></span></button>
              </div>
              <button @click="FullCalendarAPI.today()" class="fc-today-button fc-button fc-button-primary"
                      type="button">
                  {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HEADER_TODAY}}
              </button>
              <div class="fc-button-group" v-if="FullCalendarAPI">
                <button
                    @click="changeView(calendarType === 'calendar' ? 'dayGridMonth' : 'resourceTimelineMonth')"
                    class="fc-dayGridMonth-button fc-button fc-button-primary"
                    :class="{'fc-button-active': FullCalendarAPI.view.type === 'dayGridMonth' ||  FullCalendarAPI.view.type === 'resourceTimelineMonth'}"
                    type="button">
                {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HEADER_MONTH}}
                </button>
                <button
                    @click="changeView(calendarType === 'calendar' ? 'timeGridWeek' : 'resourceTimelineWeek')"
                    class="fc-timeGridWeek-button fc-button fc-button-primary"
                    :class="{'fc-button-active': FullCalendarAPI.view.type === 'timeGridWeek' ||  FullCalendarAPI.view.type === 'resourceTimelineWeek'}"
                    type="button">
                {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HEADER_WEEK}}
                </button>
                <button
                    @click="changeView(calendarType === 'calendar' ? 'timeGridDay' : 'resourceTimelineDay')"
                    class="fc-timeGridDay-button fc-button fc-button-primary"
                    :class="{'fc-button-active': FullCalendarAPI.view.type === 'timeGridDay' ||  FullCalendarAPI.view.type === 'resourceTimelineDay'}"
                    type="button">
                {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HEADER_DAY}}
                </button>
              </div>
            </div>
            <div class="fc-toolbar-chunk d-flex align-center">
              <component @click="FullCalendarAPI.today()" :is=" !$vuetify.breakpoint.mdAndUp ? 'h5' : 'h2'"
                         v-if="FullCalendarAPI" class="fc-toolbar-title cursor-pointer">{{ FullCalendarAPI.view.title }}
              </component>
              <v-menu
                  v-if="!$vuetify.breakpoint.mdAndUp && FullCalendarAPI"
                  bottom
                  left
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                      light
                      icon
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="FullCalendarAPI.today()">
                    <v-list-item-title>
                        {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HEADER_TODAY}}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider class="my-0" />
                  <v-list-item
                      @click="changeView(calendarType === 'calendar' ? 'dayGridMonth' : 'resourceTimelineMonth')"
                      :class="{'active': FullCalendarAPI.view.type === 'dayGridMonth' ||  FullCalendarAPI.view.type === 'resourceTimelineMonth'}">
                    <v-list-item-title>
                        {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HEADER_MONTH}}
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item
                      @click="changeView(calendarType === 'calendar' ? 'timeGridWeek' : 'resourceTimelineWeek')"
                      :class="{'active': FullCalendarAPI.view.type === 'timeGridWeek' ||  FullCalendarAPI.view.type === 'resourceTimelineWeek'}">
                    <v-list-item-title>
                        {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HEADER_WEEK}}
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item
                      @click="changeView(calendarType === 'calendar' ? 'timeGridDay' : 'resourceTimelineDay')"
                      :class="{'active': FullCalendarAPI.view.type === 'timeGridDay' ||  FullCalendarAPI.view.type === 'resourceTimelineDay'}">
                    <v-list-item-title>
                        {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HEADER_DAY}}
                    </v-list-item-title>
                  </v-list-item>
                  <v-divider class="my-0" />

                  <template v-if="$vuetify.breakpoint.smAndDown">
                    <v-list-item
                        @click="clickCustomButton(calendarType ==  'calendar' ? 'resourceTimelineDay' : 'dayGridMonth')">
                      <v-list-item-title
                          v-text="calendarType ==  'calendar' ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_SEE_RESOURCES : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_SEE_CALENDAR "></v-list-item-title>
                    </v-list-item>
                    <v-divider v-if="!$vuetify.breakpoint.smAndUp" class="my-0" />
                    <v-list-item v-if="!$vuetify.breakpoint.smAndUp" @click="openSearch">
                      <v-list-item-title>
                          {{toolbar ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_HIDE_FILTER : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_FILTER}}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-else>
                    <v-list-item @click="clickCustomButton('dayGridMonth')"
                                 :class="{'active': calendarType ==  'calendar'}">
                      <v-list-item-title>
                          {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_CALENDAR}}
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-0" />
                    <v-list-item @click="clickCustomButton('resourceTimelineDay')"
                                 :class="{'active': calendarType !=  'calendar'}">
                      <v-list-item-title>
                          {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_RESOURCES}}
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </v-list>
              </v-menu>
            </div>
            <div v-if="$vuetify.breakpoint.mdAndUp" class="fc-toolbar-chunk">
              <div class="fc-button-group">
                <button @click="clickCustomButton('dayGridMonth')"
                        class="fc-calendarView-button fc-button fc-button-primary "
                        :class="{'fc-button-active': calendarType ==  'calendar'}"
                        type="button">
                    {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_CALENDAR}}
                </button>
                <button @click="clickCustomButton('resourceTimelineDay')"
                        class="fc-resourceView-button fc-button fc-button-primary"
                        :class="{'fc-button-active': calendarType !=  'calendar'}"
                        type="button">
                    {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_RESOURCES}}
                </button>
              </div>
            </div>

            <button v-if="!$vuetify.breakpoint.mdAndUp" @click="FullCalendarAPI.next()"
                    class="fc-next-button fc-button fc-button-primary" type="button" aria-label="next"><span
                class="fc-icon fc-icon-chevron-right"></span></button>
          </div>
        </div>
        <div class="position-relative">
          <FullCalendar ref="fullCalendar" :options="config"/>
          <div
            v-if="eventLoading"
            class="full-calendar-loader"
          >
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </div>
        </div>
        <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            max-width="450px"
            offset-x
            :z-index="100"
        >
          <v-card
              v-if="Object.keys(selectedEvent).length"
              max-width="450px"
              flat
          >
            <v-toolbar
                :color="selectedEvent.calendar ? selectedEvent.color : '#909090'"
                dark
            >
              <v-toolbar-title class="cursor-default text-wrap ametys-truncate-2"
                                :data-ametys-tooltip="selectedEvent.title"
                                v-html="selectedEvent.title"
              ></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn v-if="userRights.canEditEvent && (userRights.canHandleResource || !selectedEvent.isResource)" icon @click="openDialog">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-menu bottom left v-if="(userRights.canCreateEvent || userRights.canRemoveAnyEvent|| (userRights.canRemoveSelfEvent && selectedEvent.isCreator)) && (userRights.handleResource || !selectedEvent.isResource)">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-if="userRights.canCreateEvent" @click="duplicateEvent">
                    <v-list-item-title>
                        {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_DUPLICATE_EVENT}}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="userRights.canRemoveAnyEvent || (userRights.canRemoveSelfEvent && selectedEvent.isCreator)" @click="deleteConfirm = true">
                    <v-list-item-title>
                        {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_DELETE_EVENT}}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn icon @click="selectedOpen = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <div class="mb-4">
                <div class="text-subtitle-2">
                  <!-- In the same day -->
                  {{selectedEvent.end}}
                  <template v-if="getDate(selectedEvent.start) == getDate(selectedEvent.end)">
                    {{ getDate(selectedEvent.end) }}
                  </template>
                  <!-- In the many days -->
                  <template v-else>
                      {{ getDate(selectedEvent.start) }} - {{ getDate(selectedEvent.end) }}
                  </template>
                </div>
                <template v-if="!selectedEvent.allDay">
                    {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_FROM}} {{ getTime(selectedEvent.start) }} {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_TO}} {{ getTime(selectedEvent.end) }}
                </template>
                <template v-else>
                    {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_FULL_DAY}}
                </template>
              </div>
              <div v-if="selectedEvent.resourceIds.length" class="mb-4">
                <div class="text-subtitle-2 mb-1">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_RESOURCES}}</div>
                <v-chip v-for="id in selectedEvent.resourceIds" :key="id" v-text="getResourceTextById(id)" class="pointer-events-none mr-2 mb-1"
                        small></v-chip>
              </div>

              <div v-if="selectedEvent.location" class="mb-4">
                <div class="text-subtitle-2 mb-1">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_PLACE}}</div>
                {{ selectedEvent.location }}
              </div>
              <div v-if="selectedEvent.tags.length" class="mb-4">
                <div class="text-subtitle-2 mb-1">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_TAGS}}</div>
                <!-- Tags -->
                <tags-short class="mt-3"
                    :line-width="260"
                    :lines="2"
                    :tags="selectedEvent.tags"/>
              </div>

              <div v-if="selectedEvent.description" class="mb-4">
                <div class="text-subtitle-2">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_DESCRIPTION}}</div>
                <div class="white-space-pre-line ametys-truncate-5" :data-ametys-tooltip="selectedEvent.description">
                  {{ selectedEvent.description }}
                </div>
              </div>
              <div v-if="selectedEvent.creatorFullName">
                <div class="text-subtitle-2">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_CREATOR}}</div>
                {{ selectedEvent.creatorFullName }}
              </div>

              <div v-if="selectedEvent.calendar" class="mt-4">
                <div class="text-subtitle-2 mb-1">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_CALENDAR}}</div>
                <v-chip small class="pointer-events-none">
                  <color-indicator classes="mr-2" :color="selectedEvent.color"/>
                  {{ selectedEvent.calendar.title }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
        <!-- End Delete Confirm Dialog -->
        <av-dialog v-model="deleteConfirm" :dialog="true" variant="dark" @close="deleteConfirm = false"
                   :title="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_DELETE_EVENT_CONFIRM_TITLE"
                   okBtnText="Supprimer" @submit="confirmedDeleteEvent()">
            <span v-html="deleteMsg()"></span>
        </av-dialog>
        <!-- End Delete Confirm Dialog -->
      </v-card-text>
    </v-card>
    <occurrence-dialog
        :title="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_MOVE_TITLE"
        :display="occurrenceModalMove"
        :okBtnTextCallback="confirmedMoveEvent"
        :cancelBtnCallback="cancelBtnCallback"
        :closeOnSubmit="false"
        >
    </occurrence-dialog>

    <occurrence-dialog
        :title="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_DELETE_TITLE"
        :display="occurrenceModalDelete"
        :okBtnTextCallback="confirmedDeleteEventCallBack"
        :cancelBtnCallback="deleteCancelBtnCallback"
        >
    </occurrence-dialog>

    <av-dialog
      v-model="resourceUnavailable"
      variant="dark"
      @close="resourceUnavailable = false"
      :submitBtn="false"
      :title="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OPERATION_RANGE_MOVE_TITLE"
    >
        <span v-html="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OPERATION_CANT_MOVE_MESSAGE"></span>
    </av-dialog>
  </v-col>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'

import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import momentPlugin from '@fullcalendar/moment';
import AvDialog from "../utils/AvDialog";
import eventsMixin from './../../mixins/eventsMixin';
import ColorIndicator from '../utils/ColorIndicator';
import _ from 'lodash/lodash'
import TagsShort from './events/TagsShort';
import i18n from '../MessageFrench';
import OccurrenceDialog from "./../dialogs/event/OccurrenceDialog";

import Hammer from 'hammerjs'

import moment from "moment";

import frLocale from '@fullcalendar/core/locales/fr'
const locales = {fr: frLocale}

const today = moment().format('YYYY-MM-DD')

export default {
  name: "CalendarContainer",
    props: ['colorsMap'],

  components: {
    FullCalendar,
    AvDialog,
    ColorIndicator,
    TagsShort,
    OccurrenceDialog
  },

  mixins: [eventsMixin],

  data() {
    return {
      eventLoading: false,
      onSwipe: false,
      allDay: false,
      selectedOpen: false,
      selectedElement: null,
      selectedEvent: {},
      movedEvent: {},
      movedRevert: null,
      FullCalendarAPI: null,
      deleteConfirm: false,
      occurrenceModalDelete: false,
      occurrenceModalMove: false,
      resourceUnavailable: false,
      toolbar: false,
      i18n: i18n
    }
  },

  computed: {
    ...mapGetters({
      events: 'events/getEvents',
      calendarType: 'calendars/getCalendarType',
      resources: 'resources/getResources',
      allTags: 'tags/getTags',
      canCreateTag: 'tags/canCreate',
    }),

    ...mapState({
      byCategory: state => state.filters.byCategory,
      byName: state => state.filters.byName,
      start: state => state.filters.start,
      end: state => state.filters.end,
      byResourceCalendar: (state) => state.filters.byResourceCalendar,
      userRights: state => state.userRights.rights,
      availableResources: state => state.resources.resourcesAvailability,
    }),

    config() {
      return {
        ...this.calendarOptions,
        ...this.eventHandlers
      }
    },

    calendarOptions() {
      return {
        height:650,
        allDayContent: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_FULL_DAY",
        eventTimeFormat: 'LT',
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin, momentPlugin],
        editable: this.userRights.canEditEvent,
        initialView: 'dayGridMonth',
        initialDate: today,
        now: today,
        locale: locales["fr"],
        scrollTimeReset: false,
        events: this.events,
        resourceOrder:'title',
        resources: this.resources,
        // allDaySlot: this.allDay,
        aspectRatio: 2.5,
        weekNumbers: true,
        views: {
          resourceTimelineWeek: {
            weekNumbers: false,
            type: 'resourceTimelineYear'
          },
          resourceTimelineMonth: {
            weekNumbers: false,
            displayEventEnd: false,
            type: 'resourceTimelineMonth'
          },
          resourceTimelineDay: {
            weekNumbers: false,
            type: 'resourceTimelineDay'
          }
        },
        dayHeaderContent: date => {
          return Object.prototype.hasOwnProperty.call(window, 'FullCalendarAPI') && window.FullCalendarAPI.view.type === 'timeGridWeek' ? moment(date.date).locale("fr").format('ddd Do') : date.text
        },
        resourceAreaHeaderContent: "ressources",
        resourceLabelContent: (arg) => {
          let icon = arg.resource.extendedProps.icon || '';

          return {
            html: `
            <div id="resource-${arg.resource.id}" class="d-flex">
             <div class="mr-4 resource-item ametys-truncate-1 js-tooltiper text-wrap text-truncate" data-ametys-tooltip="${arg.resource.title}">
                <i class="${icon} ${icon ? 'mr-2' : 'd-none'}"></i>
                ${arg.resource.title}
             </div>
             <div class="ametys-truncate-1 js-tooltiper text-wrap resource-description text-truncate" data-ametys-tooltip="${arg.resource.extendedProps.instructions}">${arg.resource.extendedProps.instructions}</div>
            </div>
          `
          }
        },
        customButtons: {
          calendarView: {
            text: 'Calendrier',
            click: () => {
              this.$store.dispatch('filters/resetFilters')
              this.switchViewButtons('dayGridMonth', window.FullCalendarAPI.view.type)
            }
          },
          resourceView: {
            text: 'Ressources',
            click: () => {
              this.$store.dispatch('filters/resetFilters')
              this.switchViewButtons('resourceTimelineDay', window.FullCalendarAPI.view.type)
            }
          }
        },
        headerToolbar: false,
        eventClick: this.eventClick,
        dateClick: this.dateClick,
        navLinks: false
      }
    },

    eventHandlers() {
      return {
          eventDrop: this.onEventDropOrResize,
          eventResize: this.onEventDropOrResize,
        eventDidMount: this.eventRender,
        datesSet: this.viewChanged,
        windowResize: function(/*e,s,arg*/) {
         return false
        }
      }
    },

    isMobile() {
      return this.$vuetify.breakpoint.xsOnly
    }
  },

  methods: {


      confirmedMoveEvent(choice) {

          this.occurrenceModalMove = false;

          if (this.movedEvent.getResources().length)
          {
              this.checkResourceBeforeMoveEvent(choice);
          }
          else
          {
              this.moveEvent(choice);
          }
      },

      moveEvent(choice) {
          this.updateEvent({...this.movedEvent.extendedProps,
              choice: choice,
              zoneId: moment.tz.guess(),
              id: this.movedEvent.extendedProps.eventId,
              resourceIds: this.movedEvent.getResources().map(resource => resource.id),
              startDate: moment(this.movedEvent.start).toISOString(),
              endDate: this.movedEvent.end ? moment(this.movedEvent.end).toISOString() : moment(this.movedEvent.start).toISOString(), //Take startDate as default end date to handle one day events
              parentId: this.movedEvent.extendedProps.calendarId
          })
      },

      async checkResourceBeforeMoveEvent(choice) {

          var startDate = moment(this.movedEvent.start).toISOString();
          var endDate = this.movedEvent.end ? moment(this.movedEvent.end).toISOString() : moment(this.movedEvent.start).add(1, 'day').toISOString()

          // If we are checking for a recurring event, check all events since the first one, as we should also check events between first occurence and current one
          if (this.movedEvent.extendedProps && moment(this.movedEvent.extendedProps.originalStart) < moment(startDate) && this.movedEvent.extendedProps.recurrenceType != 'NEVER')
          {
              startDate = moment(this.movedEvent.extendedProps.originalStart).toISOString();
          }
          if (this.movedEvent.extendedProps.recurrenceType != 'NEVER')
          {
              endDate = this.movedEvent.extendedProps.untilDate ? moment(this.movedEvent.extendedProps.untilDate).toISOString() : moment(endDate).add(1, 'y').toISOString();
          }

          var eventStartDateAsStr = moment(this.movedEvent.start).toISOString();
        const params = {
          id: this.movedEvent.extendedProps.eventId,
          allDay: this.movedEvent.extendedProps.fullDay,
          startDate: startDate,
          endDate: endDate,
          zone: moment.tz.guess(true),
          eventStartDateAsStr: eventStartDateAsStr,
          eventEndDateAsStr: moment(this.movedEvent.extendedProps.fullDay ? moment(this.movedEvent.start).toISOString() : moment(this.movedEvent.end).toISOString()).toISOString(),
          recurrenceType: this.movedEvent.extendedProps.recurrenceType,
          originalOccurrenceStartAsStr: moment(this.movedEvent.extendedProps.originalOccurrenceStart).toISOString(),
        }

        const isStartInsideRange = new Date(params.startDate).getTime() >= new Date(this.start).getTime()
        const isEndInsideRange = new Date(params.endDate).getTime() <= new Date(this.end).getTime()

        var loadResourceEndpoint;
        /*  Is In The Current Date Range */
        if(isStartInsideRange && isEndInsideRange && this.movedEvent.extendedProps.recurrenceType == 'NEVER'){
            loadResourceEndpoint = 'resources/loadResourcesWithAvailabilityInCurrentRange'
        }else{
            loadResourceEndpoint = 'resources/loadResourcesWithAvailability'
        }

        await this.$store.dispatch(loadResourceEndpoint, params)
        var eventsList = this.movedEvent.getResources().map(resource => resource.id)

        // Check if any resource is both unavailable and used for moved event
        if (this.availableResources.some(resource => !resource.available && eventsList.includes(resource.id)))
        {
            // If so, revert the move and display message to the user
            this.cancelBtnCallback();
            this.resourceUnavailable = true;
        }
        else
        {
            // Else, move the event and display a message to the user
            this.moveEvent(choice);
        }
      },

      cancelBtnCallback() {
          this.occurrenceModalMove = false;
          this.movedRevert();
      },

      deleteCancelBtnCallback() {
          this.occurrenceModalDelete = false;
      },

      openSearch() {
          this.toolbar = !this.toolbar
        window.VEvent.fire('search', this.toolbar)
      },

    confirmedDeleteEvent() {
        if(this.selectedEvent.recurrenceType && this.selectedEvent.recurrenceType != 'NEVER')
        {
            this.occurrenceModalDelete = true;
        }
        else
        {
            this.deleteEvent({
                id: this.selectedEvent.id
              })
        }

    },
    confirmedDeleteEventCallBack(choice) {
        this.deleteEvent({
            id: this.selectedEvent.id,
            occurrence: moment(this.selectedEvent.occurrenceDate).toISOString(),
            choice: choice
            })

      },

    ...mapActions({
      updateEvent: 'events/updateEvent',
      deleteEvent: 'events/deleteEvent',
      loadAsideEvents: 'events/loadAsideEvents'
    }),

    clickCustomButton(calendarType) {
          window.VEvent.fire('change-calendar-type', calendarType);
          this.switchViewButtons(calendarType, window.FullCalendarAPI.view.type)
    },

    swipeSupport() {
      const $calendar = window.FullCalendarAPI.el,
          mc = new Hammer($calendar, {
            inputClass: Hammer.TouchInput
          })

      mc.get('swipe').set({direction: Hammer.DIRECTION_ALL})
      mc.on('pan', () => {
        clearTimeout(this.openModalTimer)
        setTimeout(() => {
          clearTimeout(this.openModalTimer)
        })
      })
      mc.on("swipeleft swiperight", function (ev) {
        const dir = ev.type
        if (dir === 'swipeleft') {
          const scrollableView = document.querySelector('.fc-scroller .fc-timeline-header .fc-scrollgrid-sync-table')
          if (scrollableView) {
            const scroller = scrollableView.closest('.fc-scroller')
            if (scroller.scrollWidth <= scroller.scrollLeft + scroller.getBoundingClientRect().width) {
              setTimeout(() => {
                this.onSwipe = false
              }, 2000)
              return window.FullCalendarAPI.next()
            }
          } else {
            setTimeout(() => {
              this.onSwipe = false
            }, 2000)
            window.FullCalendarAPI.next()
          }
        } else {
          const scrollableView = document.querySelector('.fc-scroller .fc-timeline-header .fc-scrollgrid-sync-table')
          if (scrollableView) {
            const scroller = scrollableView.closest('.fc-scroller')
            if (scroller.scrollLeft === 0) {
              setTimeout(() => {
                this.onSwipe = false
              }, 2000)
              return window.FullCalendarAPI.prev()
            }
          } else {
            setTimeout(() => {
              this.onSwipe = false
            }, 2000)
            window.FullCalendarAPI.prev()
          }
        }
      });
    },

    isActiveResource() {
      const clearActive = () => {
        const activeEl = document.querySelector('.fc-datagrid-cell-cushion.active')
        if (activeEl) activeEl.classList.remove('active')
      }

      if (!this.byCategory && window.FullCalendarAPI.view.type === 'resourceTimelineDay') {
        clearActive()
      }

      if (!this.byCategory || window.FullCalendarAPI.view.type !== 'resourceTimelineDay') return false
      clearActive()
      document.getElementById(`resource-${this.byCategory.id}`)
          .closest('.fc-datagrid-cell-cushion')
          .classList.add('active')
    },

    getDate(date) {
      return moment(date).locale("fr").format("i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_DAY_DATE_FORMAT")
    },

    getTime(date) {
      return moment(date).locale("fr").format('LT')
    },

    openDialog() {
      window.VEvent.fire('open-event-dialog', this.selectedEvent)
      this.selectedOpen = false
    },

    duplicateEvent() {
      window.VEvent.fire('open-event-dialog', {...this.selectedEvent, id: ''})
      this.selectedOpen = false
    },

    eventClick(data) {
      if(this.eventLoading) return
      const open = () => {
        const event = data.event

        this.selectedEvent = {
          id: event.extendedProps.eventId,
          title: event.title,
          start: moment(event.start).format('YYYY-MM-DD HH:mm'),
          end: event.end == null ? moment(event.start).format('YYYY-MM-DD HH:mm') : moment(event.end).format('YYYY-MM-DD HH:mm'),
          recurrenceType: event.extendedProps.recurrenceType,
          untilDate: event.extendedProps.untilDate,
          occurrenceDate: event.extendedProps.occurrenceDate,
          allDay: event.allDay,
          description: event.extendedProps.description,
          tags: event.extendedProps.tags,
          location: event.extendedProps.location,
          calendar: event.extendedProps.calendar,
          organizatorEmail: event.extendedProps.organizatorEmail,
          members: event.extendedProps.members,
          creatorFullName: event.extendedProps.creatorFullName,
          isCreator: event.extendedProps.isCreator,
          color: event.extendedProps.color,
          resourceIds: event.extendedProps.resourceIds,
          originalStart: event.extendedProps.originalStart,
          originalOccurrenceStart: event.extendedProps.originalOccurrenceStart,
          isResource: event.extendedProps.isResource,
        }

        this.selectedElement = data.el

        setTimeout(() => {
          this.selectedOpen = true
        }, data.clickType == 'fromEventCard' ? 300 : 10)

      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }
    },

    dateClick({dateStr, resource}) {
      // Check if can book resource
      if(resource && !(this.userRights.canHandleResource && this.userRights.canCreateEvent))return;

      // Check if can create event
      if(!resource && !this.userRights.canCreateEvent) return;

      if (!this.selectedOpen) window.VEvent.fire('event-dialog-from-date', {dateStr, resource})

    },

    onEventDropOrResize({event, revert}) {
        this.movedEvent = event;
        this.movedRevert = revert;
        if(event.extendedProps.recurrenceType && event.extendedProps.recurrenceType != 'NEVER')
        {
            this.occurrenceModalMove = true;
        }
        else
        {
            this.confirmedMoveEvent(null)
        }
    },

    eventRender(event) {
      event.el.dataset.id = event.event.id
    },

    eventDrop(info) {
        if (!confirm("Are you sure about this change?")) {
          info.revert();
        }
      },

    changeView(view){
      window.FullCalendarAPI.changeView(view)
      if(view == 'resourceTimelineMonth' || view == 'resourceTimelineWeek'){
        this.scrollResourceToToday(view);
      }
    },
    viewChanged(dateInfo) {

      const type = dateInfo.view.type,
          $allDayEl = document.querySelector('.fc-daygrid-body.fc-daygrid-body-unbalanced.fc-daygrid-body-natural')

      $allDayEl ? $allDayEl.style.visibility = 'collapse' : null

      if (type === 'timeGridWeek' || type === 'timeGridDay') {
        window.FullCalendarAPI.scrollToTime('08:00')

        if (type === 'timeGridWeek') {
          if (dateInfo.view.calendar.getEvents().filter(event => event.start.getTime() >= dateInfo.start.getTime()
              && event.start.getTime() <= dateInfo.end.getTime()
              && event.allDay).length
            ) {
            $allDayEl ? $allDayEl.style.visibility = 'unset' : null
          }
        }

        if (type === 'timeGridDay') {
          if (dateInfo.view.calendar.getEvents().filter(event => event.start.getTime() === dateInfo.start.getTime()
              && event.start.getTime() <= dateInfo.end.getTime()
              && event.allDay).length
            ) {
            $allDayEl ? $allDayEl.style.visibility = 'unset' : null
          }
        }
      }

      this.allDay = !!dateInfo.view.calendar.getEvents()
          .filter(event => event.start.getTime() == dateInfo.start.getTime())
          .length




      const isStartInsideRange = !this.start ? false : new Date(dateInfo.startStr).getTime() >= new Date(this.start).getTime()
      const isEndInsideRange = !this.end ? false :  new Date(dateInfo.endStr).getTime() <= new Date(this.end).getTime()

      if (!isStartInsideRange || !isEndInsideRange) {
        this.eventLoading = true;
        if(window.FullCalendarAPI) window.FullCalendarAPI.removeAllEvents()
        this.$store.dispatch('filters/setDateRange', { start: dateInfo.startStr, end: dateInfo.endStr });
        this.loadEvents(()=> this.eventLoading = false)
      }
    },

    switchViewButtons(type, subType = false) {
      const calendarBtn = document.querySelector('.fc-calendarView-button'),
          resourceBtn = document.querySelector('.fc-resourceView-button'),
          actoveClass = 'fc-button-active'

      if (type === 'dayGridMonth') {
        if (this.$vuetify.breakpoint.mdAndUp) {
          resourceBtn.classList.remove(actoveClass)
          calendarBtn.classList.add(actoveClass)
        }
        this.$store.commit('calendars/SET_TYPE', 'calendar')
        setTimeout(() => {
              if (subType === 'resourceTimelineWeek')
              {
                  window.FullCalendarAPI.changeView('timeGridWeek')
              }
              else if (subType === 'resourceTimelineDay')
              {
                  window.FullCalendarAPI.changeView('timeGridDay')
              }
              else if (subType === 'resourceTimelineMonth')
              {
                  window.FullCalendarAPI.changeView('dayGridMonth')
              }
        })
      }
      else
      {
        if (this.$vuetify.breakpoint.mdAndUp)
        {
          calendarBtn.classList.remove(actoveClass)
          resourceBtn.classList.add(actoveClass)
        }
        this.$store.commit('calendars/SET_TYPE', 'resources')

        setTimeout(() => {
          if (subType === 'timeGridWeek') {
            window.FullCalendarAPI.changeView('resourceTimelineWeek')
          } else if (subType === 'timeGridDay') {
            window.FullCalendarAPI.changeView('resourceTimelineDay')
          } else if (subType === 'dayGridMonth') {
            window.FullCalendarAPI.changeView('resourceTimelineMonth')
          }
        })
      }
      if(type == 'resourceTimelineDay'){
        this.scrollResourceToToday(subType);
      }
    },
    getResourceTextById(id) {
      const item = _.first(_.filter(this.resources, ['id', id]));
      return item ? item.title : '-';
    },
    scrollResourceToToday(type) {
      if (type == false) return

      setTimeout(() => {
        const header = document.querySelector(
          'table th +td+th .fc-scroller'
        );

        if (!header) return

        let todayEl = null

        if (type == 'dayGridMonth' || type == 'resourceTimelineMonth') todayEl = document.querySelector('.fc-timeline-slot-label.fc-day-today')

        if (type == 'timeGridWeek' || type == 'resourceTimelineWeek') todayEl = document.querySelector('.fc-timeline-slot-label.fc-day-today')

        if (todayEl)
        {
            header.scroll({ left: todayEl.offsetLeft, behavior: 'smooth' })
        }

      }, 1);
    },
    handleCalendarHeight(){
      const content = document.querySelector('.fc-view-harness')
      const toolbar = document.querySelector('.ametys-toolbar')
      if (toolbar)
      {
          const additionalHeight = this.getElOffset(toolbar).top - toolbar.offsetHeight - 20
          window.FullCalendarAPI.setOption('height', additionalHeight + content.offsetHeight)
      }
    },
    getElOffset(element) {
      let top = 0,
        left = 0
      do
      {
          top += element.offsetTop || 0
          left += element.offsetLeft || 0
          element = element.offsetParent
      } while (element)

      return {
        top: top,
        left: left,
      }
    },

    deleteMsg() {
      let text = "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_DELETE_EVENT_CONFIRM_MESSAGE";
      text = text.replace(0, '<span class="primary--text">' + this.selectedEvent.title + '</span>');
      return text;
    },
  },

  watch: {
    isMobile() {
      setTimeout(() => {
        window.FullCalendarAPI.changeView(window.FullCalendarAPI.view.type)
      })
    },
    calendarType(type) {
      this.isActiveResource()
      this.switchViewButtons(type === 'calendar' ? 'dayGridMonth' : 'resourceTimelineDay')
      if(type == 'calendar' && this.byResourceCalendar) {
        this.eventLoading = true;
        this.$store.dispatch('filters/setByResourceCalendar', false)
        if(window.FullCalendarAPI) window.FullCalendarAPI.removeAllEvents()
        this.loadEvents(()=> this.eventLoading = false)
      }
    },
    selectedOpen(val) {
      document.querySelectorAll('.fc-daygrid-event.active').forEach($event => $event.classList.remove('active'))
      document.querySelectorAll('.event.active').forEach($event => $event.classList.remove('active'))

      if (val) {
        const el = document.querySelector(`[data-event-card-id="${this.selectedElement.getAttribute('data-id')}"]`)
        this.selectedElement.classList.add('active')
        el ? el.classList.add('active') : null
      }
    },
  },
  mounted() {
    window.FullCalendarAPI = this.$refs.fullCalendar.getApi()
    this.FullCalendarAPI = this.$refs.fullCalendar.getApi()
    window.VEvent.listen('open-event-details', this.eventClick)
    this.switchViewButtons('dayGridMonth')
    this.swipeSupport()
    document.querySelector('style').textContent += "@media screen and (max-width:1035px) { .fc-view-harness {min-height: 400px;} .fc-button {margin-bottom: 10px !important;} .fc-toolbar.fc-header-toolbar {flex-direction:column;} .fc-toolbar-chunk { display: table-row; text-align:center; padding:5px 0; } }";
    window.addEventListener('mouseup', (e) => {
      if (e.target.closest('.fc-col-header-cell-cushion') && window.innerWidth <= 960) {
        const view = window.FullCalendarAPI.view.type
        setTimeout(() => {
          window.FullCalendarAPI.changeView(view)
        })
      }
    })
    this.loadAsideEvents({start: moment().format(), end: moment().add(1, 'year').format()})
    this.handleCalendarHeight()
  }
}
</script>

<style lang="scss">
$primary: #9575cd;
$focus-event-bg: #e8e8e8;
$focus-event-border: $focus-event-bg;

.fc {
  .fc-button {
    font-size: 14px;
    font-family: "Poppins Medium";

    &-primary {
      color: $primary;
      border: none;
      background-color: rgba($primary, .2);
      transition: .3s;

      &:not(:disabled).fc-button-active {
        background-color: $primary;
      }

      &:hover,
      &:focus,
      &:active,
      &:disabled {
        color: $primary;
        border: none;
        box-shadow: none !important;
        background-color: rgba($primary, .3);
      }
    }

    .fc-icon {
      vertical-align: bottom;
    }
  }

  &-direction-ltr .fc-button-group > .fc-button:not(:first-child) {
    margin: 0;
  }

  .fc-toolbar-title {
    color: $primary;
    font-family: "Poppins Regular";
    text-transform: capitalize;
  }

  .fc-col-header-cell-cushion,
  .fc-daygrid-event {
    color: #000;
  }

  .fc-daygrid-day-number {
    color: #7F8182;
  }

  .fc-daygrid-day.fc-day-today,
  .fc-highlight,
  .fc-timeline-slot-lane.fc-day-today,
  .fc-timeline-slot-lane.fc-slot-today {
    background-color: rgba(149, 117, 205, 0.2);
  }

  .fc-daygrid-dot-event .fc-event-title {
    font-family: "Poppins Regular";
  }

  .fc-event-title,
  .fc-event-time {
    transition: .4s;
  }

  .fc-daygrid-event-focus {
    transition: .4s;

    &.fc-daygrid-event {
      background-color: $focus-event-bg !important;
      border-color: $focus-event-border !important;

      .fc-event-title,
      .fc-event-time {
        color: #000 !important;
      }
    }
  }
  .fc-col-header-cell-cushion {
    font-family: "Poppins Medium";
  }

  .fc-col-header-cell-cushion {
    &:hover {
      color: #9575CD;
      text-decoration: none !important;
    }
  }

  .fc-datagrid-cell-cushion.active {
    background-color: rgba(#9575CD, .1)
  }
}

.fc-daygrid-dot-event.active {
  background: rgba(0, 0, 0, 0.1);
  background-image: initial;
  background-position-x: initial;
  background-position-y: initial;
  background-size: initial;
  background-repeat-x: initial;
  background-repeat-y: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: rgba(0, 0, 0, 0.1);
}

.fc-header-toolbar {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: unset !important;
  align-items: flex-start;

  .fc-button {
    margin-bottom: 0 !important;
  }

  & {
    .fc-toolbar-chunk:first-child {
      //display: none;
    }
  }

  h5.fc-toolbar-title {
    font-size: 16px !important;
  }
}

.resource-item {
  color: #6D758A;
  font-family: "Poppins Regular";
}

.resource-description {
  color: #8A8A8A;
  font-style: italic;
}


.resourceTimelineWeek,
.resourceTimelineDay {


  .fc td {
    vertical-align: bottom;
  }
}

@media (max-width: 960px) {
  .fc-daygrid-week-number {
    display: none !important;
  }
}


.v-dialog > .v-card > .v-card__title,
.av-dialog .av-dialog-text {
  font-family: "Poppins Medium";
}

.font-weight-light {
  font-family: "Poppins Light" !important;
}

.font-weight-bold {
  font-family: "Poppins Bold" !important;
}

.white-space-pre-line{
  white-space: pre-line;
}

.full-calendar-loader{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(#fff,0.5);
  z-index: 9999;
}

.input-field__pointer:not(.v-input--is-focused) {
  .v-select__selections {
    cursor: pointer !important;
    input {
      cursor: pointer !important;
    }
  }
}
.input-field__pointer {
  .v-input__append-inner {
    cursor: pointer !important;
  }
}

.flex-fill-max{
  width: 100%!important;
  max-width: 100%!important;
  flex: 0 0 100%!important;
}

.fc-daygrid-event-harness {
    overflow: hidden;
}

.fc-timeline-event .fc-event-time {
    flex-shrink: 0;
}
.fc-timegrid-event-short .fc-event-title, .fc-timegrid-event-short .fc-event-time {
    line-height: 1;
}

.fc-scrollgrid-section-body   .fc-scrollgrid-sync-table {
    border-bottom: 1px solid !important;
}

// Allow to display all-day in one line
.fc .fc-timegrid-axis-cushion {
    text-align: right;
    max-width: 70px;
}

@media (max-width: 600px) {
  .fc-col-header-cell-cushion, .fc-timegrid-axis-cushion, .fc-timegrid-slot-label-cushion
  {
      font-weight: 400;
      font-size: 13px;
  }
}
</style>
