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
 
import AmetysFront from 'AmetysFront';
import { callMethod } from '../../helper/ServerCommHelper';
import i18n from 'i18n';

export const namespaced = true;
export const state = {
  byName: '',
  byType: '',
  typeName: '',
  byTag: {},
  allSystem: false,
  hideFolders: false,
  searchActive: false,
  loading: false,
};

export const mutations = {
  SET_BY_NAME(state, request) {
    state.byName = request;
  },
  SET_BY_TYPE(state, request) {
    state.byType = request;
  },
  SET_BY_TYPE_NAME(state, request) {
    state.typeName = request;
  },
  SET_BY_TAG(state, request) {
    state.byTag = request;
  },
  SET_ALL_SYSTEM(state, request) {
    state.allSystem = request;
  },
  SET_HIDE_FOLDERS(state, request) {
    state.hideFolders = request;
  },
  SET_SEARCH_ACTIVE(state, request) {
    state.searchActive = request;
  },
  SET_HIDE_LOADING(state, loading) {
    state.loading = loading;
  },
};

export const getters = {
  isFilter: state => {
    return state.hideFolders
  },
  filterIsTag: state => {
    return Object.keys(state.byTag).length > 0
  }
};

export const actions = {
  async searchByType({commit}, item) {
    commit('SET_SEARCH_ACTIVE', true);
    commit('SET_HIDE_FOLDERS', true);
    commit('SET_BY_TYPE', {
      name: item.name,
      type: item.type
    });

    try
    {
        let result = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'searchFilesByType',
            parameters: [item.type]
        });
        
        commit('files/SET_FILES', result.resources, {root: true})
        commit('folders/SET_TREE_ACTIVE_FOLDER', null, {root: true})
        window.VEvent.fire('reset-filter')
    }
    catch(e)
    {
        commit('folders/SET_TREE_ACTIVE_FOLDER', null, {root: true})
        
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_SEARCH_ERROR,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: e
        });
    }
  },
  
  /**
   * Search files by name
   */
  async searchByName({commit}, name) {
    commit('SET_SEARCH_ACTIVE', true);
    commit('SET_HIDE_FOLDERS', true);

    try
    {
        let result = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'searchFiles',
            parameters: [name, AmetysFront.getAppParameter("sitemapLanguage")]
        });
        
        commit('files/SET_FILES', result.resources, {root: true})
        commit('folders/SET_TREE_ACTIVE_FOLDER', null, {root: true})
    }
    catch(e)
    {
        commit('folders/SET_TREE_ACTIVE_FOLDER', null, {root: true})
        
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_SEARCH_ERROR,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: e
        });
    }
  },
  
  /**
   * Reset search
   */
  resetFilters({ commit, dispatch/*, rootState*/ }, reload) {
    commit('SET_BY_NAME', '');
    commit('SET_BY_TYPE', '');
    commit('SET_BY_TYPE_NAME', '');
    commit('SET_BY_TAG', '');
    commit('SET_HIDE_FOLDERS', false);
    commit('SET_SEARCH_ACTIVE', false);

    if (reload) {
      dispatch('folders/getFolder', null, {root: true})
    }
  }
};
