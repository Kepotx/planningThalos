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
import { openWebdavUri } from './WebdavHelper';
import { initOnlyOffice } from './OnlyOfficeHelper';
import { createOnlyOfficeModal } from './OnlyOfficeHelper';
import { initOnlyOfficeModal } from './OnlyOfficeHelper';
import { closeEditor } from './OnlyOfficeHelper';

import AmetysUtils from 'AmetysUtils';
import i18n from 'i18n';
import DocsAPI from 'DocsAPI';

export const namespaced = true;
export const state = {
  files: [],
  currentFiles: [],
  category: '',
  tag: '',
  msOfficeEditionResponse: ''
};

function _transform(file)
{
    file.readableLastModified = AmetysUtils.toMomentDate(file.lastModified);
    file.readableCreationDate = AmetysUtils.toMomentDate(file.creationDate);
    file.readableLength = AmetysUtils.getReadableSize(file.length);
    file.fileTypeIcon = AmetysUtils.getFileTypeIcon(file.fileType);
    file.name = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
}

export const mutations = {
  SET_FILES(state, files) {
    files.map(file => {
        _transform(file);
    });
      
    state.files = files;
  },
  SET_CURRENT_FILES(state, files) {
    state.currentFiles = files;
  },
  ADD_FILE(state, file) {
    _transform(file);
    state.files.push(file);
  },
  UPDATE_FILE(state, payload) {
    _transform(payload.data);
    
    let file = state.files.findIndex(file => file.id == payload.id);
    state.files[file].lastModified = payload.data.lastModified;
    state.files[file].readableLastModified = payload.data.readableLastModified;
    state.files[file].length = payload.data.length;
    state.files[file].readableLength = payload.data.readableLength;
  },
  SET_CATEGORY(state, category) {
    state.category = category;
  },
  SET_TAGS(state, payload) {
    let file = state.files.findIndex(file => file.id === payload.id);

    state.files[file].tags = payload.tags;
  },
  DELETE_FILE(state, payload) {
    state.files.splice(payload.file, 1);
    state.currentFiles.splice(payload.file, 1);
  },
  RENAME_FILE(state, payload) {
    payload.file.name = payload.name;
    payload.file.path = payload.path;
    payload.file.encodedPath = payload.encodedPath;
  },
  SET_MS_OFFICE_RESPONSE(state, response) {
    state.msOfficeEditionResponse = response;
  }
};

export const getters = {
  getFiles: (state, getters, rootState) => {
    let files = [];
    
    function byTag(file, tagId) {
      if (tagId) {
        return file.tags.find(tag => tag.text === tagId)
      } else {
        return true;
      }
    }

    files = state.files.filter(file => {
      return byTag(file, rootState.filters.byTag.text)
    })
    
    return files.sort(function(f1, f2) {
        return f1.name.toLowerCase() < f2.name.toLowerCase() ? -1 : (f1.name.toLowerCase() > f2.name.toLowerCase() ? 1 : 0);
    });
  },
  
  getTags: (state /*, getters, rootState */) => {
    let tags = [];
    function exists(tag)
    {
        return tags.find(t => t.text === tag.text)
    }
    
    state.files.forEach(file => {
        file.tags.forEach(tag => {
            if (!exists(tag)) {
                tags.push(tag);
            }
        });
    });
    return tags;
  }
};

export const actions = {
  
  /**
   * Tag a file
   * @param {Object} payload
   * @param {String} payload.id the file id
   * @param {String} payload.tags the tags
   */
  async setTags({ commit }, payload) {
    
    try
    {
        let data = await callMethod({
          role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
          methodName: 'setTags',
          parameters: [ payload.id, payload.tags]
        });
        
        commit('tags/ADD_TAGS', data.newTags, { root: true });
        
        commit('SET_TAGS', {
          id: payload.id,
          tags: data.fileTags
        });
    }
    catch(e)
    {
         window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_TAG,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
  },
  
  async checkFileExists ({commit, /* state,  dispatch*/}, payload) 
  {
    try
    {
        return await callMethod({
          role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
          methodName: 'resourceExists',
          parameters: [payload.folderId, payload.fileName]
        });
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_ADD,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_CHECK_NAME_ERROR,
            details: "Unable to check if file exists !" + e
          });
    }
  },
  
  /**
   * Updload file
   */
  async uploadFile ({commit, state, dispatch}, payload) {
    
    window.VEvent.fire('loaderStart', {
        text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_UPLOAD_STARTED
    });
    
    try
    {
        let response = await callMethod({
          role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
          methodName: 'addFile',
          parameters: [payload.file, payload.folderId, payload.unzip /* unarchive */, payload.rename /* allow rename */, payload.update /* allow update */]
        });
        
        if (response.unzip)
        {
            // refresh current folder
            dispatch('folders/reload', null, {root: true});
            
            window.VEvent.fire('loaderEnd', {
                text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILES_UPLOAD_ENDED
            });
        }
        else if (response.resources)
        {
            if (!payload.update)
            {
                for (let i=0; i < response.resources.length; i++)
                {
                    commit('ADD_FILE', response.resources[i]);
                }
                
                window.VEvent.fire('loaderEnd', {
                    text: response.resources.length > 1 ? i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILES_UPLOAD_ENDED : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_UPLOAD_ENDED
                });
            }
            else
            {
                for (let i=0; i < response.resources.length; i++)
                {
                    commit('UPDATE_FILE', {
                          id:  response.resources[i].id,
                          data: response.resources[i]
                    });
                    
                    let file = state.files.findIndex(file => file.id == response.resources[i].id);
                    dispatch('info/setItem', {item: state.files[file], notOpen: true});
                }
                
                window.VEvent.fire('loaderEnd', {
                    text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_UPDATED
                });
            }
        }
        else
        {
            var errorMsg = response.message;
            var text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR;
            if (errorMsg == 'rejected')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_MAX_UPLOAD_SIZE_ERROR;
            }
            else if (errorMsg == 'locked')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FOLDER_ERROR_LOCKED;
            }
            else if (errorMsg == 'already-exist')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_ALREADY_EXIST;
            }
            else if (errorMsg == 'unzip-errort')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_UNZIP_ERROR;
            }
            
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_ADD,
                text : text,
                details: null
            });
        }
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_ADD,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: "Unable to add file !" + e
          });
    }
  },
  
  /**
   * Add a new file
   */
  async addFile({ commit /*, state */}, payload) {
    
    try
    {
        let newFile = await callMethod({
          role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
          methodName: 'getFile',
          parameters: [payload.id]
        })
        
        commit('ADD_FILE', newFile);
    }
    catch(e) 
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_GET,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
  },
  
  /**
   * Delete a file
   */
  async deleteFile({ commit, state }, payload) {
    
    window.VEvent.fire('loaderStart', {
        text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETING
    });
    
    try
    {
        let result = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'deleteObject',
            parameters: [[payload.id]]
        })
        
        if (result.success)
        {
            let file = state.files.findIndex(file => file.id == payload.id);
            commit('DELETE_FILE', {file: file});
            
            setTimeout(() => {
              window.VEvent.fire('loaderEnd', {
                text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETE_FILE_SUCCESS
              });
            }, 500);
        }
        else
        {
            var errorMsg = result.message;
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_DELETE,
                text : errorMsg == 'locked' ? i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_LOCKED : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
                details: null
            });
        }
    }
    catch(e)
    {
         window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_DELETE,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
  },
  
  /**
   * Rename a file
   */
  async renameFile({ commit, state }, payload) {
    let file = state.files.find(file => file.id === payload.id);
    let fullName = payload.name + "." + file.fileExtension;
    let success = false;
    
    try
    {
        let result = await callMethod({
           role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
           methodName: 'renameFile',
          parameters: [file.id, fullName]
        });
        
        if (!result.success)
        {
            var text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR;
            if (result.message == 'locked')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_LOCKED;
            }
            else if (result.message == 'already-exist')
            {
                text = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_ALREADY_EXISTS;
            }
            
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_RENAME,
                text : text,
                details: null
            });
        }
        else
        {
            success = true;
            commit('RENAME_FILE', {file: file, name: payload.name, path: result.path, encodedPath: result.encodedPath});
        }
    }
    catch(e) 
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_RENAME,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
    
    return success;
  },
  
  /**
   * Open file for edition with MS office
   */
  async msOfficeEditFile({ commit /*, state*/ }, payload) {
    
    try 
    {
        // Get the file uri whith token
        let webdavUri = await callMethod({
           role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
           methodName: 'generateWebdavUri',
          parameters: [payload.file.id]
        })
        
        // Open WebDAV uri
        openWebdavUri(payload.file, webdavUri);
        
        window.VEvent.fire('loaderEnd', {
            text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_MSOFFICE_EDIT_OPEN_END
        });
    }
    catch(e)
    {
        commit('SET_MS_OFFICE_RESPONSE', "OPEN_URI_ERROR");
         
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_MSOFFICE_EDIT_ERROR_RESULT_TITLE,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_MSOFFICE_EDIT_ERROR_RESULT_MESSAGE,
            details: 'Unable to open the document in edition ' + payload.file.id
        });
    }
  },
  
  /**
   * Open file for edition with Only Office
   */
  async onlyOfficeEditFile(obj /* { commit, state } */, payload) {
    
    let triesCount = 0;

    async function onFailureCb(docEditor)
    {
        // Try again (until 3 tries)
        // Note: this error occurred when the document is open with a old document.key (cache issue)
        // it should be ok the second time
        
        closeEditor(docEditor);
        
        if (triesCount < 3)
        {
            window.console.log("Failed to open OnlyOffice edition (outdated document key), try again...");
            triesCount++;
            await openOnlyOfficeDocument();
        }
        else
        {
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ONLYOFFICE_EDIT_ERROR_TITLE,
                text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ONLYOFFICE_EDIT_ERROR_MESSAGE
            });
        }
    }
    
    async function openOnlyOfficeDocument()
    {
        let docEditor = null;
        
        try 
        {
            let ooInfos = await callMethod({
               role: 'org.ametys.plugins.workspaces.documents.onlyoffice.OnlyOfficeManager',
               methodName: 'getOnlyOfficeInfo',
               parameters: [payload.file.id]
            });
            
            let ooConfig = initOnlyOffice(ooInfos, onFailureCb, payload.isEdition, payload.isMobile);
            
            let sign = await callMethod({
                role: 'org.ametys.plugins.workspaces.documents.onlyoffice.OnlyOfficeManager',
                methodName: 'signConfiguration',
                parameters: [JSON.stringify(ooConfig)]
            });
            
            if (sign && sign.success)
            {
                if (sign.signature)
                {
                    ooConfig.token = sign.signature;
                }
                
                // Create iframe for edition
                if (payload.isEdition)
                {
                    createOnlyOfficeModal();
                }
                
                docEditor = new DocsAPI.DocEditor(payload.divId, ooConfig);
                
                ooConfig.docEditor = docEditor;
                
                if (payload.isEdition)
                {
                    initOnlyOfficeModal(docEditor, payload.callback);
                }
            }
            else
            {
                closeEditor(docEditor);
                window.VEvent.fire('loaderFail', { 
                    title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ONLYOFFICE_EDIT_ERROR_TITLE,
                    text : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_DOCUMENTS_ONLYOFFICE_SIGNATURE_KEY,
                    details: 'Unable to open the document in edition ' + payload.file.id
                });
            }
        }
        catch(e)
        {
            closeEditor(docEditor);
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ONLYOFFICE_EDIT_ERROR_TITLE,
                text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ONLYOFFICE_EDIT_ERROR_MESSAGE,
                details: 'Unable to open the document in edition ' + payload.file.id + ': ' + e
            });
        }
    }
    
    openOnlyOfficeDocument();
  }
};
