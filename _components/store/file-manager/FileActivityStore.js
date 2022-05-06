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
import AmetysUtils from 'AmetysUtils';

export const namespaced = true;
export const state = {
  activity: [],
  loaded: false,
  loadBy: 4,
  allActivityCount: 0
};

export const mutations = {
  CLEAR_ACTIVITY(state) {
    state.activity = [];
  },
  SET_ACTIVITY(state, activity) {
    state.activity = activity;
  },
  SET_LOAD_BY(state, count) {
    state.loadBy = count;
  },
  SET_ALL_ACTIVITY_COUNT(state, count) {
    state.allActivityCount = count;
  }
};

export const getters = {
  getActivity: state => {
    return state.activity;
  }
};

export const actions = {
  async loadActivity({ commit, state }, item) {
    
    commit('CLEAR_ACTIVITY');
    
    if (item && item.type !== 'folder') 
    {
      let activities = await callMethod({
        role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
        methodName: 'resourceHistory',
        parameters: [item.id]
      });
      
      activities.forEach(activity => {
        activity.readableCreatedAt = AmetysUtils.toMomentDate(activity.createdAt);
      });
      
      commit('SET_ALL_ACTIVITY_COUNT', activities.length);
      commit('SET_ACTIVITY', activities.slice(0, state.loadBy));
    } 
  },
  
  /**
   * Restore a version
   */
  async restoreVersion({/* commit, state, */ dispatch}, payload) {
    
    await callMethod({
       role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
       methodName: 'restoreResource',
       parameters: [payload.item.id, payload.rawVersionName]
    });
    
    // Reload activity
    dispatch('loadActivity', payload.item);
  }
}
