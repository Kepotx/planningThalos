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
import AmetysFront from 'AmetysFront';
import i18n from 'i18n';

export const namespaced = true;
export const state = {
  items: [],
  folders: [],
  files: [],
  isSelecAll: false
};

export const mutations = {
  SET_ITEMS(state, payload) {
    state.folders = payload.folders;
    state.files = payload.files;
    state.isSelecAll = true;
  },
  UNSET_ITEMS(state) {
    state.folders = [];
    state.files = [];
    state.isSelecAll = false;
  },
  SELECT_ITEM(state, payload) {
    state[payload.type].push(payload.item);
  },
  UNSELECT_ITEM(state, payload) {
    state[payload.type] = state[payload.type].filter((value) => {
      return value.id !== payload.id;
    });

    state.isSelecAll = false;
  }
};

export const getters = {
  getSelectedCount: state => {
    return state.files.length + state.folders.length;
  },
  getIsSelectedItem: state => payload => {
    if (state[payload.type].length > 0) {
      return !!state[payload.type].find(item => item.id === payload.id)
    } else {
      return false;
    }
  },
  canDeleteItems: state => {
    var canDelete = false;
    state.files.forEach(f => { 
        if (f.rights['delete']) {
            canDelete = true;
            return;
        }
    });
    state.folders.forEach(f => { 
        if (f.rights['delete']) {
            canDelete = true;
            return;
        }
    });
    return canDelete;
  }
};

export const actions = {
  selectAll({commit, rootGetters}) {
    let folders = rootGetters['folders/getFolders'];
    let files = rootGetters['files/getFiles'];

    var items = {
      folders: folders,
      files: files,
    };

    commit('SET_ITEMS', items);
  },
  unselectAll({commit, getters}) {
    let count = getters.getSelectedCount;

    commit('UNSET_ITEMS', []);
    
    while(count > 0)
    {
        window.VEvent.fire('showMobileHeader');
        count--;
    }
  },
  select({commit}, payload) {
    commit('SELECT_ITEM', payload);
    window.VEvent.fire('hideMobileHeader');
  },
  unselect({commit, getters}, payload) {
    if (getters.getIsSelectedItem({type: payload.type, id: payload.item.id})) {
      commit('UNSELECT_ITEM', {
        type: payload.type,
        id: payload.item.id
      });
    }
    
    window.VEvent.fire('showMobileHeader');
  },
  
  /**
   * Delete the selected items
   */
  async deleteSelectedItems({ commit, state, dispatch, rootState}) {
    
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETING
    });

    let itemIds = [];
    state.files.forEach(f => { 
        if (f.rights['delete']) {
            itemIds.push(f.id) 
        }
    });
    state.folders.forEach(f => { 
        if (f.rights['delete']) {
            itemIds.push(f.id) 
        }
    });
   
    try
    {
        let result = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'deleteObject',
            parameters: [itemIds]
        });
        
        if (!result.error)
        {
            dispatch('folders/openFolder', rootState.folders.currentFolder, {root: true})
            commit('UNSET_ITEMS')
        
            setTimeout(() => {
                window.VEvent.fire('loaderEnd', {
                text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETE_ITEMS_SUCCESS
            });
            }, 500);
        }
        else  
        {
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETE_ITEMS_ERROR,
                text : result.error == 'locked' ? i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETE_ITEMS_ERROR_LOCKED : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
                details: null
            });
        }
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETE_ITEMS_ERROR,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
  },
  
  /**
   * Download the selected items
   */
  downloadSelectedItems({/*commit,*/ state}) {
    
    let params = "name=export";
    state.folders.forEach(f => { params+= "&file=" + f.id });
    state.files.forEach(f => { params+= "&file=" + f.id });
    
    window.location.href = AmetysFront.getPluginDirectPrefix('explorer') + '/folder/archive.zip?' + params;
  }
};
