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
import { callMethod } from '../../helper/ServerCommHelper';

export const namespaced = true;

export const state = {
  folders: [],
  open: [],
  openedFolder: {}
};

export const mutations = {
  SET_TREE_FOLDERS(state, folders) {
    state.folders = folders;
  },
  SET_OPEN_FOLDERS(state, folders) {
    state.open.push(folders);
  },
  SET_OPENED_FOLDER(state, folder) {
    state.openedFolder = folder;
  },
  ADD_FOLDER(state, folder) {
    var findItem = function(id, items = null) {
      if (!items) {
        items = state.folders;
      }

      return items.reduce((acc, item) => {
        if (acc) {
          return acc;
        }

        if (item.id === id) {
          return item;
        }

        if (item.children) {
          return findItem(id, item.children);
        }

        return acc;
      }, null);
    }

    var item = findItem(state.open[state.open.length - 1].id)

    if (item) {
      if (!item.children) {
        Vue.set(item, 'children', []);
      }

      item.children.push(folder)
      state.open.push(item);
    } else {
      state.folders.push(folder);
    }
  },
  DELETE_FOLDER(state, folder) {
    var findItem = function(id, items = null) {
      if (!items) {
        items = state.folders;
      }

      return items.reduce((acc, item) => {
        if (acc) {
          return acc;
        }

        if (item.id === id) {
          return item;
        }

        if (item.children) {
          return findItem(id, item.children);
        }

        return acc;
      }, null);
    }

    var item = findItem(folder.id)
    var parentItem = findItem(item.parentId)
    var folders = []

    if (parentItem) {
      if (parentItem.children.length === 1) {
        parentItem.children = undefined
      } else {
        folders = parentItem.children
      }
    } else {
      folders = state.folders
    }

    const index = folders.findIndex(child => child.id === item.id)
    folders.splice(index, 1)
  }
}

export const actions = {
  async loadRootFolders({ commit, state }, root) {
    
    try
    {
        let folders = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'getFolders',
            parameters: [root.id]
        });
        
        commit('SET_TREE_FOLDERS', folders);
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_GET,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
  },

  async loadChildrens({ commit, state }, item) {
    
    try
    {
        let folders = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'getFolders',
            parameters: [item ? item.id : null]
        });
        
        item.children = folders;
    
        commit('SET_OPEN_FOLDERS', item)
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_GET,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
  },

  async setOpenedFolder({ commit, state }, item) {
    item.name = 'asd'
  }
}