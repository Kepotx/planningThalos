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
import { transformToMember } from '../../helper/MemberHelper';

/**
 * Vuex store for current project members, and searching users to add
 */
export const namespaced = true;
export const state = {
    search: {
        usersAndGroups: [],
        finished: false
    },
    needReload: false
};

export const mutations = {
        SET_SEARCHED_USERS: (state, { users }) => Vue.set(state.search, 'usersAndGroups', users),
        SET_SEARCH_DATA: (state, { searchData }) => Vue.set(state.search, 'existingSearchData', searchData),
        SET_SEARCH_NEED_RELOAD: (state, { needReload }) => Vue.set(state, 'needReload', needReload)
};

export const actions = {
    async searchUsersAndGroups({ commit, state }, { limit, criteria, continueSearch}) {
        
        const searchStateName = 'search';
        state[searchStateName].finished = false;
        if(!continueSearch || state.search.existingSearchData != null)
        {
            var results = await callMethod({
                role: 'org.ametys.plugins.workspaces.project.ProjectManager',
                methodName: 'searchUserByProject',
                parameters: [
                  AmetysFront.getAppParameter('projectName'),
                  limit,
                  criteria,
                  continueSearch ? state.search.existingSearchData : null
                ]
              });
              state[searchStateName].finished =  true;

              
              commit('SET_SEARCHED_USERS', {
                   users: continueSearch ? state.search.usersAndGroups.concat(results.memberList.map(transformToMember)) : results.memberList.map(transformToMember)
              });
              commit('SET_SEARCH_DATA', {
                  searchData: results.searchData
              });
              commit('SET_SEARCH_NEED_RELOAD', {
                  needReload: false
              });
        }
        
    }
};

export const getters = {
    isSearchFullyLoaded: state => {
        return state['search'].finished;
    }
};
