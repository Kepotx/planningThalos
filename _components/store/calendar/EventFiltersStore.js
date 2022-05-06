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
  byCategory: false,
  byResourceCalendar: false,
  byGroup: '',
  chip: {},
  start: null,
  end: null,
};

export const mutations = {
  SET_DATE_RANGE(state, { start, end }) {
    state.start = start;
    state.end = end;
  },
  SET_BY_NAME(state, name) {
    state.byName = name;
  },
  SET_BY_CATEGORY(state, category) {
    state.byGroup = '';
    state.byCategory = category;
    state.byResourceCalendar = false;
  
    state.chip = {
      id: category.id,
      color: category.color,
      icon: category.icon,
      name: category.name || category.title,
      title: category.title,
    };
  },
  SET_BY_RESOURCE_CALENDAR(state, val) {
    state.byResourceCalendar = val;

    state.byGroup = '';
    state.byCategory = false;

    state.chip = {};
  },
  RESET_CATEGORY(state) {
    state.byGroup = '';
    state.byCategory = false;

    state.chip = {};
  },
  SET_BY_GROUP(state, group) {
    state.byCategory = false;
    state.byGroup = group.key;
    
    if (group) {
      state.chip = {
        color: false,
        name: group.label,
      };
    }
  },
};

export const getters = {
  isFilter: (state) => {
    return state.byName.length > 0 || Object.keys(state.byCategory).length > 0 || state.byGroup.length > 0;
  },
  isResourceCalendar: (state) => {
    return state.byResourceCalendar
  },
  isFilterByCategory: (state) => {
    return state.byCategory || state.byGroup;
  },
};

export const actions = {
  setDateRange({ commit }, value) {
    commit('SET_DATE_RANGE', value);
  },
  setByName({ commit }, value) {
    commit('SET_BY_NAME', value);
  },
  setByCategory({ commit }, value) {
    commit('SET_BY_CATEGORY', value);
  },
  resetCategory({ commit }, value) {
    commit('RESET_CATEGORY', value);
  },
  setByResourceCalendar({ commit }, value) {
    commit('SET_BY_RESOURCE_CALENDAR', value);
  },
  setByGroup({ commit }, value) {
    commit('SET_BY_GROUP', value);
  },
  resetFilters({ commit }) {
    commit('SET_BY_NAME', '');
    commit('SET_BY_CATEGORY', false);
    commit('SET_BY_GROUP', {
      key: '',
    });
    commit('calendars/SET_TYPE', null, { root: true });
  },
};
