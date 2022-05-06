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
import i18n from 'i18n';
import AmetysFront from 'AmetysFront';

export const namespaced = true;

export const state = {
  rights: {}
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

      await callMethod({
          role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
          methodName: 'getUserRights',
          parameters: [
            AmetysFront.getAppParameter('projectName')
          ]
      })
      .then(rights => {
        commit('SET_RIGHTS', rights);
        window.VEvent.fire('loader', false);
      })
      .catch(error => {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_RIGHTS_ERROR_MSG,
            text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
            details: error
        });
      })
    }
}
