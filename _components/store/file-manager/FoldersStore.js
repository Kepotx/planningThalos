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
import i18n from 'i18n';

import {callMethod} from '../../helper/ServerCommHelper';

export const namespaced = true;
export const state = {
  folder: {},
  folders: [],
  isFilter: false,
  currentFolder: {},
  treeOpenedFolders: [],
  treeActiveFolder: []
};

export const mutations = {
  SET_CURRENT_FOLDER(state, folder) {
    state.currentFolder = folder;
  },
  SET_FOLDERS(state, folders) {
    state.folders = folders;
  },
  SET_FOLDER(state, folder) {
    state.folder = folder;
  },
  CREATE_FOLDER(state, folder) {
    if (state.currentFolder.hasOwnProperty('children')) {
      state.currentFolder.children.push(folder)
    } else {
      Vue.set(state.currentFolder, 'children', [folder])
    }

    state.folders = state.currentFolder.children
  },
  RENAME_FOLDER(state, payload) {
    payload.folder.name = payload.name;
  },
  DELETE_FOLDER(state, payload) {
    state.folders.splice(payload.index, 1);
  },
  SET_CURRENT_FOLDERS_AND_FILES(state, payload) {
    payload.folder.name = payload;
  },
  SET_TREE_OPENED_FOLDER(state, folder) {
    state.treeOpenedFolders = folder;
  },
  ADD_TREE_OPENED_FOLDER(state, folder) {
    state.treeOpenedFolders.push(folder);
  },
  SET_TREE_ACTIVE_FOLDER(state, folder) {
    state.treeActiveFolder = [folder];
  }
}

export const getters = {
  /**
   * Get breadcrumb for current opened folder
   */
  getPath: (state /*, getters, rootState */) => {
    if (!state.currentFolder.hasOwnProperty('id')) return false
    let paths = []
    let obj = [state.folder]
    let pathKey = 0

    let collectPath = function () {
      if (!state.currentFolder.path.length) {
        return paths
      }

      obj.forEach(child => {
        if (child.id === state.currentFolder.path[pathKey]) {
          paths.push(child)

          pathKey++

          if (pathKey < state.currentFolder.path.length) {
            obj = child.children
            return collectPath()
          }
        }
      })

      return paths
    }

    return collectPath()
  },

  /**
   * Get folders of the current opened folder
   */
  getFolders: (state, getters, rootState) => {
    if (rootState.filters.hideFolders) {
      return []
    } 
    else {
        return state.folders.sort(function(f1, f2) {
            return f1.name.toLowerCase() < f2.name.toLowerCase() ? -1 : (f1.name.toLowerCase() > f2.name.toLowerCase() ? 1 : 0);
        });
    }
  }
}

export const actions = {

  /**
   * Reload the current folder (folders and files)
   */
  async reload({commit, /* state,  dispatch */}) {
    try
    {
        var data = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'getFoldersAndFiles',
            parameters: [state.currentFolder.id]
        });
        
        state.currentFolder.children = data.children;
        
        commit('SET_FOLDERS', data.children);
        commit('files/SET_FILES', data.files, {root: true});
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
  
  /**
   * Get folder's data with child folders and files
   */
  async getFolder({commit, /* state, */ dispatch}, id) {
    commit('filters/SET_HIDE_LOADING', true, {root: true});

    try
    {
        var data = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'getFoldersAndFiles',
            parameters: [id]
        });
        
        console.log(data);
        if (!id)
            data.root = true;

        commit('SET_FOLDER', data);
        commit('SET_CURRENT_FOLDER', data)
        commit('SET_FOLDERS', data.children);

        commit('files/SET_FILES', data.files, {root: true});

        commit('filters/SET_HIDE_LOADING', false, {root: true});
        dispatch('filters/resetFilters', false, {root: true});
        dispatch('selectedItems/unselectAll', null, {root: true});
      
        dispatch('info/setItem', {item: data, notOpen: true}, {root: true});
        
        if (!data.root)
        {
            window.VEvent.fire('hideMobileHeader');
        }
        else
        {
            window.VEvent.fire('showMobileHeader', true);
        }
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

  /**
   * Expand folder in tree
   */
  async expandFolder(obj /*{commit , state, dispatch}*/, folder) {
    
    try
    {
        let data = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'getFoldersAndFiles',
            parameters: [folder.id]
        });
        
        folder.children = data.children
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

  /**
   * Open folder from breadcrumb
   */
  async breadOpenFolder({commit, /*state,*/  dispatch}, folder) {

    try
    {
        let data = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'getFoldersAndFiles',
            parameters: [folder.id]
        });
        
        commit('filters/SET_HIDE_LOADING', true, {root: true});

        commit('SET_CURRENT_FOLDER', folder)
        commit('SET_FOLDERS', folder.children ? folder.children : []);
        commit('ADD_TREE_OPENED_FOLDER', folder);
        commit('SET_TREE_ACTIVE_FOLDER', folder);

        commit('files/SET_FILES', data.files, {root: true});

        commit('filters/SET_HIDE_LOADING', false, {root: true});
        dispatch('filters/resetFilters', false, {root: true});
        dispatch('selectedItems/unselectAll', null, {root: true});

        dispatch('info/setItem', {item: folder, notOpen: true}, {root: true});
        
        if (folder.root)
        {
            window.VEvent.fire('showMobileHeader', true);
        }
        else
        {
            window.VEvent.fire('hideMobileHeader');
        }
        
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

  /**
   * Open folder
   */
  async openFolder({commit, /* state,*/ dispatch}, folder) {
    commit('filters/SET_HIDE_LOADING', true, {root: true});

    try
    {
        let data = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'getFoldersAndFiles',
            parameters: [folder.id]
        });
        
        if (data.hasOwnProperty('children')) {
            folder.children = data.children;
        } else {
            Vue.delete(folder, 'children')
        }

        commit('SET_CURRENT_FOLDER', folder)
        commit('SET_FOLDERS', folder.children ? folder.children : []);
        commit('ADD_TREE_OPENED_FOLDER', folder);
        commit('SET_TREE_ACTIVE_FOLDER', folder);

        commit('files/SET_FILES', data.files, {root: true});

        commit('filters/SET_HIDE_LOADING', false, {root: true});
        dispatch('filters/resetFilters', false, {root: true});
        dispatch('selectedItems/unselectAll', null, {root: true});

        dispatch('info/setItem', {item: folder, notOpen: true}, {root: true});

        window.VEvent.fire('reset-filter');
        window.VEvent.fire('hideMobileHeader');
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_GET,
          text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
          details: null
        });
        
        commit('filters/SET_HIDE_LOADING', false, {root: true});
        dispatch('filters/resetFilters', false, {root: true});

        window.VEvent.fire('reset-filter')
    }
  },

  /**
   * Create a new folder
   * @param {String} name the folder's name
   */
  async createFolder({commit, state/*, dispatch*/}, name) {
    
    try
    {
        let result = await callMethod({
          role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
          methodName: 'addFolder',
          parameters: [state.currentFolder.id /* parentId */, name /* name */, '' /* description*/]
        });
        
        if (result.error) 
        {
            var text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR;
            if (result.message == 'locked')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_LOCKED;
            }
            else if (result.message == 'already-exist')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_ALREADY_EXIST;
            }
            
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_ADD,
                text : text,
                details: null
            });
        } 
        else 
        {
            commit('CREATE_FOLDER', result);
            commit('ADD_TREE_OPENED_FOLDER', state.currentFolder);
        }
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_ADD,
          text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
          details: null
        });
    }
  },

  /**
   * Delete a folder
   */
  async deleteFolder({commit, state, dispatch}, payload) {

    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETING
    });

    if (state.currentFolder.children.length === 1) {
      state.treeOpenedFolders = state.treeOpenedFolders.filter(f => f.id !== state.currentFolder.id)
    }

    try
    {
        let result = await callMethod({
          role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
          methodName: 'deleteFolder',
          parameters: [payload.id]
        });
        
        if (!result.error) 
        {
            let index = state.folders.findIndex(folder => folder.id == payload.id);
            commit('DELETE_FOLDER', {index: index});

            if (state.currentFolder.id == payload.id) 
            {
              let parentIndex = state.folders.findIndex(folder => folder.id == payload.parentId);
              dispatch('getFolders', state.folders[parentIndex]);
            } 
            else if (!state.currentFolder.children.length) 
            {
              Vue.delete(state.currentFolder, 'children')
            }
    
            setTimeout(() => {
              window.VEvent.fire('loaderEnd', {
                text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETE_FOLDER_SUCCESS
              });
            }, 500);
        } 
        else 
        {
            var errorMsg = result.message;
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_DELETE,
                text : errorMsg == 'locked' ? i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_LOCKED : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
                details: null
            });
        }
        
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_DELETE,
          text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
          details: null
      });
    }
  },

  /**
   * Rename a folder
   */
  async renameFolder({commit, /*state , dispatch*/}, payload) {

    let folder = payload.folder;
    let success = false;

    try
    {
        let result = await callMethod({
          role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
          methodName: 'renameFolder',
          parameters: [folder.id, payload.name]
        });
        
        if (!result.success) 
        {
            var text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR;
            if (result.message == 'locked')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_LOCKED;
            }
            else if (result.message == 'already-exist')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_ALREADY_EXIST;
            }
            
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_RENAME,
                text : text,
                details: null
            });
          }
          else 
          {
            success = true;
            commit('RENAME_FOLDER', {folder: folder, name: payload.name});
          }
          
          return success;
    }
    catch(e)
    {
         window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_RENAME,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
    
    return success;
  }
}
