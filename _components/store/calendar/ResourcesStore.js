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

import { callMethod } from '../../helper/ServerCommHelper'

export const namespaced = true
export const state = {
  resources: [],
  resourcesAvailability: [],
}

export const mutations = {
  SET_RESOURCES(state, data) {
    data.sort((a, b) => a.title.localeCompare(b.title))
    state.resources = data
  },
  ADD_RESOURCE(state, data) {
    state.resources.push(data)
    state.resources.sort((a, b) => a.title.localeCompare(b.title))
  },
  UPDATE_RESOURCE(state, data) {
    const index = state.resources.findIndex((i) => i.id == data.id)
    if (index != -1) state.resources.splice(index, 1, data)
    state.resources.sort((a, b) => a.title.localeCompare(b.title))
  },
  DELETE_RESOURCE(state, id) {
    const index = state.resources.findIndex((i) => i.id == id)
    if (index != -1) state.resources.splice(index, 1)
  },
  SET_RESOURCES_AVAILABILITY(state, data) {
      state.resourcesAvailability = data
    },
}

export const getters = {
  getResources: (state) => {
    return state.resources
  },
}

export const actions = {
  async loadResources({ commit}) {
    await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'getResources',
    })
      .then((data ) => {
        commit('SET_RESOURCES', data)
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
            title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_LOAD_RESOURCE_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        })
      })
  },
  
  async loadResourcesWithAvailabilityInCurrentRange({ commit, rootState }, { id, startDate, endDate/*, allDay */}) {
    const resources = rootState.resources.resources
    const events = rootState.events.events
    const startInt = new Date(startDate).getTime() 
    const endInt = new Date(endDate).getTime()
  

    resources.forEach((r) => {
      let available = true;

      for (const e of events) 
      {
          for (const occurrence of e.occurrences) 
          {              
              const occurrenceStartInt =  new Date(occurrence.startDate).getTime()
              const occurrenceEndInt =  new Date(occurrence.endDate).getTime()

              const rangeCon = (startInt < occurrenceEndInt) && (occurrenceStartInt < endInt)
              if(e.id != id && (e.resourceIds || []).includes(r.id) && rangeCon)
              {
                available = false
                break
              }
          }
      }

      r.available = available
    })
    commit('SET_RESOURCES_AVAILABILITY', resources);
  },

  async loadResourcesWithAvailability({ commit }, { id, startDate, endDate, eventStartDateAsStr, eventEndDateAsStr, recurrenceType, allDay, originalOccurrenceStartAsStr, zone }) {
    await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'loadResourcesWithAvailability',
      parameters: [id, startDate, endDate, eventStartDateAsStr, eventEndDateAsStr, recurrenceType, allDay, originalOccurrenceStartAsStr, zone],
    })
      .then((data) => {
        commit('SET_RESOURCES_AVAILABILITY', data)
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
          title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_LOAD_RESOURCE_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        })
      })
  },
  
  async addResource({ commit }, resource) {
    window.VEvent.fire('loaderStart', {
        text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_RESOURCE_BEGIN_MSG"
    });
    await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'addResource',
      parameters: [
          resource.title,
          resource.icon,
          resource.instructions,
          false
      ],
    })
      .then((data) => {
        commit('ADD_RESOURCE', data)
        window.VEvent.fire('loaderEnd', {
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_RESOURCE_END_MSG"
        });
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
            title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_RESOURCE_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        })
      })
  },
  async updateResource({ commit }, resource) {
    window.VEvent.fire('loaderStart', {
      text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_BEGIN_MSG"
    });
  
    await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'editResource',
      parameters: [
          resource.id,
          resource.title,
          resource.icon,
          resource.instructions
      ],
    })
      .then((data) => {
        commit('UPDATE_RESOURCE', data)
        window.VEvent.fire('loaderEnd', {
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_END_MSG"
        });
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
            title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        })
      })
  },
  async deleteResource({ commit }, id) {
    window.VEvent.fire('loaderStart', {
      text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_RESOURCE_BEGIN_MSG"
    });
  
    await callMethod({
        role: 'org.ametys.plugins.workspaces.calendars.actions.CalendarDAO',
      methodName: 'deleteResource',
      parameters: [id],
    })
      .then((/*{ data }*/) => {
        commit('DELETE_RESOURCE', id)
        window.VEvent.fire('loaderEnd', {
            title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_RESOURCE_END_MSG",
        });
      })
      .catch((error) => {
        window.VEvent.fire('loaderFail', {
            title: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_DELETE_RESOURCE_ERROR_MSG",
          text: "i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_GENERAL_ERROR_TEXT",
          details: error,
        })
      })
  },
}
