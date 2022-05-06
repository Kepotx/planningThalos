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
import Vue from 'vue';
import AmetysFront from 'AmetysFront';
import { callMethod } from '../../helper/ServerCommHelper';

export const namespaced = true;
export const state = {
  activites: []
};

export const mutations = {
  SET_ACTIVITES(state, activites) {
    state.activites = activites;
  },
};

export const getters = {
  getActivites: state => {
    return state.activites;
  }
}

export const actions = {
  async loadActivites({ commit, state }) {
    const activites = await callMethod({
      role: 'org.ametys.plugins.workspaces.activites.ProjectActivites',
      methodName: 'getActivites'
    });

    commit('SET_ACTIVITES', activites);
  }
}