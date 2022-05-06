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
import { transformToMember } from '../../helper/MemberHelper';

export const namespaced = true;

export const state = {
  result: []
};

export const mutations = {
  SET_RESULTS(state, members) {
    state.result = members;
  }
};

export const getters = {
  getTaskMembers(state) {
    return state.result
  }
}

export const actions = {
  async getTaskMembers({ commit }) {
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
      methodName: 'getProjectMembers',
      parameters: []
    })
      .then(data => {
        commit('SET_RESULTS', data.members.map(transformToMember));
      })
  }
}
