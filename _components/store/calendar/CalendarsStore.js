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

export const namespaced = true;
export const state = {
  calendars: [],
  type: null,
  resourceCalendar: {},
};

export const mutations = {
  SET_TYPE(state, type) {
    state.type = type;
  },
  SET_CALENDARS(state, data) {
    state.calendars = data;
  },
  ADD_CALENDAR(state, data) {
    state.calendars.push(data);
  },
  UPDATE_CALENDAR(state, data) {
    const index = state.calendars.findIndex((i) => i.id == data.id);
    if (index != -1) state.calendars.splice(index, 1, data);
  },
  DELETE_CALENDAR(state, id) {
    const index = state.calendars.findIndex((i) => i.id == id);
    if (index != -1) state.calendars.splice(index, 1);
  },
};

export const getters = {
  getCalendarType: (state, _, rootState) => {
    if (state.type) return state.type;

    return rootState.filters.byGroup.length ? rootState.filters.byGroup : rootState.filters.byCategory.resource ? 'resource' : 'calendar';
  },
  calendars: (state, _, rootState) => {
    const data = [];

    state.calendars.forEach((el) => {
        const color = rootState.colorsMap[el.color] || rootState.colorsMap["col1"];
        data.push({ ...el, color: color});
    });

    return data;
  },

  resourceCalendar: (state, _, rootState) => {
      const color = rootState.colorsMap[rootState.resourceCalendar.color] || rootState.colorsMap["col1"];
    return {...rootState.resourceCalendar, color: color};
  },
};

export const actions = {
  async addCalendar({ commit }, calendar) {
    window.VEvent.fire('loaderStart', {
      text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_CALENDAR_BEGIN_MSG"
    });
    await callMethod({
      role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'addCalendar',
      parameters: [
          calendar.title,
          calendar.color.id,
          calendar.public
      ],
    })
      .then((data) => {
        commit('ADD_CALENDAR', data);
        window.VEvent.fire('loaderEnd', {
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_CALENDAR_END_MSG"
        });
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
          title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_CALENDAR_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        });
      });
  },
  async updateCalendar({ commit,rootState }, calendar) {
    window.VEvent.fire('loaderStart', {
      text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_BEGIN_MSG"
    });
    await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
        methodName: 'editCalendar',
        parameters: [
            calendar.id,
            calendar.title,
            calendar.templateDesc,
            calendar.color.id,
            calendar.public,
        ],
    })
      .then((data) => {
        commit('UPDATE_CALENDAR', data);
        
        const color = rootState.colorsMap[data.color] ? data.color : "col1";

        this.commit('events/UPDATE_EVENT_CALENDAR',{
          id: data.id,
          title: data.title,
          public: data.visibility == "PUBLIC",
          color: color
        })
        
        window.VEvent.fire('loaderEnd', {
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_END_MSG"
        });
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
          title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        });
      });
  },
  async deleteCalendar({ commit }, calendarId) {
      window.VEvent.fire('loaderStart', {
        text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_CALENDAR_BEGIN_MSG"
      });
    
      await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
        methodName: 'deleteCalendar',
        parameters: [calendarId],
      })
        .then((/*{ data }*/) => {
          commit('DELETE_CALENDAR', calendarId);
          this.commit('events/REMOVE_CALENDAR_FROM_EVENT',calendarId)
          window.VEvent.fire('loaderEnd', {
            text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_CALENDAR_END_MSG"
          });
        })
        .catch((error) => {
          window.VEvent.fire('loaderFail', {
            title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_CALENDAR_ERROR_MSG",
            text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
            details: error,
          });
        });
    },
    
  async loadCalendars({ commit, rootState }) {
    await callMethod({
      role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'getCalendars',
    })
      .then(data => {
        commit('SET_CALENDARS', data);
        commit('DELETE_CALENDAR', rootState.resourceCalendar.id);
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
          title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_LOAD_CALENDAR_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        });
      });
  },
};
