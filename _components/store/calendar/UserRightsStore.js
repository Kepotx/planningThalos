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

export const namespaced = true;

export const state = {
  rights: {
    "canCreateCalendar": true,
    "canEditCalendar": true,
    "canRemoveCalendar": true,
    "canCreateEvent": true,
    "canEditEvent": true,
    "canRemoveAnyEvent": true,
    "canRemoveSelfEvent": true,
    "canCreateTags": true,
    "canHandleResource": true,
    "canBookResource": true,
    "sharePrivateCalendar": true
  }
}

export const mutations = {
  SET_RIGHTS(state, rights) {
    state.rights = rights;
  }
};

export const getters = {
  getUserRights(state) {
    return state.rights
  }
}

export const actions = {
    async loadUserRights({ commit }) {
        window.VEvent.fire('loader', true)

        commit('SET_RIGHTS', {
          "canCreateCalendar": true,
          "canEditCalendar": true,
          "canRemoveCalendar": true,
          "canCreateEvent": true,
          "canEditEvent": true,
          "canRemoveAnyEvent": true,
          "canRemoveSelfEvent": true,
          "canCreateTags": true,
          "canHandleResource": true,
          "canBookResource": true,
          "sharePrivateCalendar": true
        });
        window.VEvent.fire('loader', false);
    }
}
