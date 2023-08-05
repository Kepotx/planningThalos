/*
 *  Copyright 2019 Anyware Services
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

import { callMethod } from '../../helper/ServerCommHelper';
import { FirebaseStore } from '../../../src/components/FirebaseFireStore'

export const namespaced = true;
export const state = {
    events: [],
    asideEvents: [],
};

export const mutations = {
  UPDATE_EVENT_CALENDAR(state, calendar) {
      state.events.forEach(e => {
          if(e.calendar && e.calendar.id == calendar.id)
          {
              e.calendar = calendar;
          }
      });
      state.asideEvents.forEach(e => {
          if(e.calendar && e.calendar.id == calendar.id)
          {
              e.calendar = calendar;
          }
      });
  },
  REMOVE_CALENDAR_FROM_EVENT(state, calendarId) {
      state.events = state.events.filter(event => {
          return event.calendar.id !== calendarId
      });
      state.asideEvents = state.asideEvents.filter(event => {
          return event.calendar.id !== calendarId
      });
  },
  SET_EVENTS(state, events) {
    state.events = events;
    window.VEvent.fire('events-loaded', {events});
  },
  SET_ASIDE_EVENTS(state, events) {
      state.asideEvents = events;
  },
  ADD_EVENT(state, event) {
    state.events.push(event);
    // Deep clone object to handle possible future operations such as splice
    state.asideEvents.push(JSON.parse(JSON.stringify(event)));
  },
};

export const getters = {
  getEvents: (state, getters, rootState, rootGetters) => {
    const type  = rootGetters['calendars/getCalendarType'];
    const byResourceCalendar = rootState.filters.byResourceCalendar
    const byCategory = rootState.filters.byCategory

    let events = state.events;

    if (type == 'calendar' && !byResourceCalendar) events = events.filter((event) => event.calendarId != rootState.resourceCalendar.id)

    if (type == 'resources') events = events.filter((event) => Object.prototype.hasOwnProperty.call(event, 'resourceIds') && event.resourceIds.length > 0)

    if (byResourceCalendar) events = events.filter((event) => event.calendarId == rootState.resourceCalendar.id)

    if (typeof byCategory == 'object' && byCategory.id) events = events.filter((e) => (e.calendarId == byCategory.id))

    const data = [];
    var resourceList = rootState.resources.resources.map(function(resource) {
        return resource['id'];
      });
    events.forEach((event) => {
      const color = rootState.colorsMap[event.calendar.color] || rootState.colorsMap["col1"];
      var filteredResources = event.resourceIds
      .filter((resource) => resourceList.includes(resource));
      event.occurrences.forEach((occurrence) => {
          data.push({
              ...event,
              color: color.bg,
              start: occurrence.startDate,
              end: occurrence.endDate,
              allDay: event.fullDay,
              id: event.id + occurrence.occurrenceDate,
              extendedProps: {...event,
                  eventId: event.id,
                  color: color.bg,
                  occurrenceDate: occurrence.occurrenceDate,
                  resourceIds: filteredResources,
                  originalStart: event.startDate,
                  originalOccurrenceStart: occurrence.startDate,
                  isResource: event.calendarId == rootState.resourceCalendar.id,
              }
          });
      });

    });

    return data;
  },

  getAsideEvents: (state, getters, rootState, rootGetters) => {
    const type  = rootGetters['calendars/getCalendarType'];
    const byResourceCalendar = rootState.filters.byResourceCalendar
    const byCategory = rootState.filters.byCategory

    let events = state.asideEvents;

    if (type == 'calendar' && !byResourceCalendar) events = events.filter((event) => event.calendarId != rootState.resourceCalendar.id)

    if (type == 'resources') events = events.filter((event) => Object.prototype.hasOwnProperty.call(event, 'resourceIds') && event.resourceIds.length > 0)

    if (byResourceCalendar) events = events.filter((event) => event.calendarId == rootState.resourceCalendar.id)

    if (typeof byCategory == 'object' && byCategory.id) events = events.filter((e) => (e.calendarId == byCategory.id))

    var data = [];

    events.forEach((event) => {
      const color = rootState.colorsMap[event.calendar.color] || rootState.colorsMap["col1"];

      event.occurrences.forEach((occurrence) => {
          data.push({
              ...event,
              color: color.bg,
              start: occurrence.startDate,
              end: occurrence.endDate,
              allDay: event.fullDay,
              id: event.id + occurrence.occurrenceDate,
              extendedProps: {...event,
                  color: color.bg
              }
          });
      });
    });

    data = data
      .filter((occurrence) => new Date(occurrence.end).getTime() >= new Date().getTime())
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 4);

    return data;
  },
};

export const actions = {
  async loadEvents({ commit },  { start, end }) {

      start + end;
      var events =  FirebaseStore.collection('events');
        commit('SET_EVENTS', events);
  },

  async loadAsideEvents({ commit },  payload ) {
    await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'getEvents',
      parameters: [payload.start || null, payload.end || null],
    })
      .then((events) => {
        commit('SET_ASIDE_EVENTS', events);
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
            title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_LOAD_EVENT_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        });
      });
  },

  async updateEvent({ rootState }, updatedEvent) {

    window.VEvent.fire('loaderStart', {
        text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_EVENT_BEGIN_MSG"
    });

    // Add edition action id
    updatedEvent.actionId = 2;
    updatedEvent.filterStart = rootState.filters.start;
    updatedEvent.filterEnd = rootState.filters.end;

    return await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
        methodName: 'editEvent',
        parameters: [updatedEvent],
    })
      .then(() => {
        // old code from ametys server that handled occurrences and
        /*
        const index = getEventIndexById(state.events, updatedEvent.id);
        state.events.splice(index, 1, data.oldEventData);
        const asideIndex = getEventIndexById(state.asideEvents, updatedEvent.id);
        state.asideEvents.splice(asideIndex, 1, data.oldEventData);
        if (updatedEvent.id != data.id)
        {
            state.events.push(data.newEventData);
            state.asideEvents.push(data.newEventData);
        }

        commit('SET_EVENT', updatedEvent);
        // Insert new tags if exists
        commit('tags/ADD_TAGS', data.newTags, { root: true });
        */
        window.VEvent.fire('loaderEnd', {
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_EVENT_END_MSG"
        });
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
          title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_EVENT_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        });
      });
  },
  async deleteEvent({ /*commit,*/ state }, payload) {
    window.VEvent.fire('loaderStart', {
        text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_EVENT_BEGIN_MSG"
    });

    await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'deleteEvent',
      parameters: [payload.id, payload.occurrence, payload.choice],
    })
      .then(() => {
        const index = getEventIndexById(state.events, payload.id);
        const asideIndex = getEventIndexById(state.asideEvents, payload.id);
        if (payload.choice == "unit")
        {
            const event = state.events[index];
            const occurenceIndex = getEventOccurrenceIndexById(event.occurrences, payload.id + "$" + payload.occurrence);
            event.occurrences.splice(occurenceIndex, 1);
            const asideEvent = state.asideEvents[asideIndex];
            const asideOccurenceIndex = getEventOccurrenceIndexById(event.occurrences, payload.id + "$" + payload.occurrence);
            asideEvent.occurrences.splice(asideOccurenceIndex, 1);
        }
        else
        {
            state.events.splice(index, 1);
            state.asideEvents.splice(asideIndex, 1);
        }
        window.VEvent.fire('loaderEnd', {
            text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_EVENT_END_MSG"
        });
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
            title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_EVENT_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        });
      });
  },
  async addEvent({ commit, rootState/*, state */}, payload) {
    window.VEvent.fire('loaderStart', {
      text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_EVENT_BEGIN_MSG"
    });

    // Add creation action id
    payload.actionId = 1;
    payload.filterStart = rootState.filters.start;
    payload.filterEnd = rootState.filters.end;

    FirebaseStore.collection("evts")
             .add({ title: payload.title, start : payload.startDate, end : payload.endDate })
             .then(() => {
               console.log("Document successfully written!");
             })
             .catch((error) => {
               console.error("Error writing document: ", error);
             });
               console.log(payload);
             commit('ADD_EVENT', payload);
     return;
     /*
    return await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
        methodName: 'addEvent',
        parameters: [payload],
    })
      .then( data  => {
        // old code from ametys server, that handled tags and event
        /*
        commit('ADD_EVENT', data.eventDataWithFilteredOccurences);
        commit('tags/ADD_TAGS', data.newTags, { root: true });
        window.VEvent.fire('loaderEnd', {
            text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_CREATE_EVENT_END_MSG"
        });
        */
        /*
        commit('ADD_EVENT', data);
        window.VEvent.fire('loaderEnd', {
            text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_CREATE_EVENT_END_MSG"
        });
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
          title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_EVENT_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        });
      });*/
  },
};

function getEventIndexById(events, id) {
  return events.findIndex((event) => event.id.toString() === id.toString());
}

function getEventOccurrenceIndexById(occurrences, id) {
    return occurrences.findIndex((occurrence) => occurrence.id.toString() === id.toString());
  }
