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
  byName: '',
  byCategory: ''
};

export const mutations = {
  SET_BY_NAME(state, request) {
    state.byName = request;
  },
  SET_BY_CATEGORY(state, request) {
    state.byCategory = request;
  }
};

export const getters = {
  isFilter: state => {
    return state.byName.length > 0 || state.byCategory.length > 0;
  }
};

export const actions = {
  resetFilters({ commit }) {
    commit('SET_BY_NAME', '');
    commit('SET_BY_CATEGORY', '');
  },
};
