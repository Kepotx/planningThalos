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
import i18n from 'i18n';

export const namespaced = true;
export const state = {
  comments: [],
};

function _transform(comment)
{
    comment.readableLastModified = AmetysUtils.toMomentDate(comment.lastModifiedDate);
    comment.readableCreationDate = AmetysUtils.toMomentDate(comment.creationDate);
    comment.content = comment.content.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

export const mutations = {
  CLEAR_COMMENTS(state) {
    state.comments = [];
  },
  SET_COMMENTS(state, comments) {
    comments.map(comment => {
        _transform(comment);
    });
    state.comments = comments;
  },
  ADD_COMMENT(state, comment) {
    // noinspection JSUnresolvedFunction
    _transform(comment);
    state.comments.unshift(comment);
  }
};

export const getters = {
  getComments: state => {
    return state.comments;
  }
};

export const actions = {
  /**
   * Load comments
   */
  async loadComments({ commit /*, state */ }, file) {
    
    commit('CLEAR_COMMENTS');
    
    try 
    {
        let comments = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'getComments',
            parameters: [ file.id, false]
        });
        
        commit('SET_COMMENTS', comments);
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_FILE_ERROR_COMMENTS,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_COMMENTS_GET_ERROR,
            details: null
        });
    }
  },
  
  /**
   * Add new comment
   */
  async addComment({ commit }, comment) {
    
    try 
    {
        let result = await callMethod({
            role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
            methodName: 'addComment',
            parameters: [ comment.fileId, comment.content]
        })
        
        if (result.commentId)
        {
            let newcomment = await callMethod({
              role: 'org.ametys.plugins.workspaces.documents.WorkspaceExplorerResourceDAO',
              methodName: 'getComment',
              parameters: [ result.commentId, false]
            });   
            
            commit('ADD_COMMENT', newcomment);
        }
        else
        {
            let errorMsg = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR;
            if (result.message == 'locked')
            {
                errorMsg = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_COMMENT_ERROR_LOCKED;
            }
            else if (result.message == 'rights')
            {
                errorMsg = i18n.PLUGINS_WORKSPACES_FILE_MANAGER_COMMENT_ERROR_RIGHTS;
            }
            
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_COMMENTS_ADD_ERROR,
                text : errorMsg,
                details: null
            });
        }
        
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_COMMENTS_ADD_ERROR,
            text : i18n.PLUGINS_WORKSPACES_FILE_MANAGER_ERROR,
            details: null
        });
    }
  }
};
