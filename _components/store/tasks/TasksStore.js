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
import i18n from 'i18n';
import { transformToMember } from '../../helper/MemberHelper';
import AmetysUtils from 'AmetysUtils';

export const namespaced = true;

export const state = {
  tasks: []
};

export const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks;
  },
  ADD_TASK(state, task) {
    state.tasks.push(task);
  },
  UPDATE_TASK(state, task) {
    const index = state.tasks.findIndex(t => t.id === task.id)

    if (index !== -1) {
      state.tasks.splice(index, 1, task)
    }
  },
  DELETE_TASK(state, payload) {
    state.tasks.splice(payload, 1);
  }
};

export const getters = {
  getAllTasks: (state) => {
    return state.tasks;
  },
  
  getTasks: (state, getters, rootState) => {
    let tasks = [];
    tasks = state['tasks'].filter(task => {
      return filterMyTask(task) && filterTaskByType(task) && filterTaskByText(task);
    
      function filterMyTask(task)
      {
        if (rootState.filters.byMy)
        {
          let currentUserId = window.ametysUser.login + "#" + window.ametysUser.populationId;
          let usersFiltered = task.assignments.filter(function(u) {
            return u.id === currentUserId;
          });
          
          return usersFiltered.length > 0;
        }
        
        // No filter
        return true;
      }

      function filterTaskByType(task)
      {
        if (rootState.filters.byType.key == "open")
        {
          return task.closeInfo == null;
        }
        else if (rootState.filters.byType.key == "closed")
        {
          return task.closeInfo != null;
        }
        
        // No filter
        return true;
      }
      
      function filterTaskByText(task)
      {
        let taskStringAttributesForSearch = ["label", "description"];
      
        if (rootState.filters.byName && rootState.filters.byName != "" && rootState.filters.byName != "#")
        {
          let isMatched = false;
          let text = AmetysUtils.deemphasize(rootState.filters.byName.toLowerCase());
          Object.keys(task).forEach(attr => {
            if (taskStringAttributesForSearch.indexOf(attr) !== -1)
            {
              if (AmetysUtils.deemphasize(task[attr].toLowerCase()).indexOf(text) !== -1)
              {
                isMatched = true;
              }
            }
            else if (attr === 'tags')
            {
              let tagText = text.startsWith("#") ? text.substring(1) : text;
              task['tags'].forEach(tag => {
                if (AmetysUtils.deemphasize(tag.toLowerCase()).indexOf(tagText) !== -1)
                {
                  isMatched = true;
                }
              });
            }
            else if (attr === 'assignments')
            {
              task['assignments'].forEach(user => {
                if (AmetysUtils.deemphasize(user.name.toLowerCase()).indexOf(text) !== -1)
                {
                  isMatched = true;
                }
              });
            }
            else if (attr === 'checkList')
            {
              task['checkList'].forEach(item => {
                if (AmetysUtils.deemphasize(item.label.toLowerCase()).indexOf(text) !== -1)
                {
                  isMatched = true;
                }
              });
            }
            else if (attr === 'attachments')
            {
              task['attachments'].forEach(file => {
                if (AmetysUtils.deemphasize(file.name.toLowerCase()).indexOf(text) !== -1)
                {
                  isMatched = true;
                }
              });
            }
            else if (attr === 'comments')
            {
              task['comments'].forEach(comment => {
                if (!comment.isDeleted && AmetysUtils.deemphasize(comment.text.toLowerCase()).indexOf(text) !== -1)
                {
                  isMatched = true;
                }
                comment.subComments.forEach(subComment => {
                  if (!subComment.isDeleted && AmetysUtils.deemphasize(subComment.text.toLowerCase()).indexOf(text) !== -1)
                  {
                    isMatched = true;
                  }
                });
              });
            }
          });
          
          return isMatched;
        }
        
        // No filter
        return true;
      }
    });

    return tasks;
  }
}

export const actions = {
  async loadTasks({ commit }) {
    window.VEvent.fire('loader', true)

    await callMethod({
        role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
        methodName: 'getTasks',
        parameters: []
    })
    .then(tasks => {
      for (let task of tasks)
      {
        actions.transformTask(task);
      }
      commit('SET_TASKS', tasks);
      window.VEvent.fire('loader', false)
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_LOAD_TASK_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },

  async addTask({commit}, {task, newFiles, newFileNames}) {
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_ADD
    });
    
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
      methodName: 'addTask',
      parameters: [
        task.tasksListId,
        task,
        newFiles,
        newFileNames
      ]
    })
    .then(data => {
      actions.transformTask(data.task);
      commit('ADD_TASK', data.task);
      commit('tags/ADD_TAGS', data.newTags, { root: true });
      
      window.VEvent.fire('loaderEnd', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_ADD
      });
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },

  async editTask({commit}, {modifiedTask, newFiles, newFileNames, deleteFiles}) {
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_EDIT
    });
    
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
      methodName: 'editTask',
      parameters: [
        modifiedTask.id,
        modifiedTask,
        newFiles,
        newFileNames,
        deleteFiles
      ]
    })
    .then(data => {
      actions.transformTask(data.task);
      commit('UPDATE_TASK', data.task);
      commit('tags/ADD_TAGS', data.newTags, { root: true });
      
      window.VEvent.fire('loaderEnd', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_EDIT
      });
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_EDIT_TASK_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },

  async deleteTask({ commit, state }, taskId) {
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_DELETE
    });
    
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
      methodName: 'deleteTask',
      parameters: [taskId]
    })
    .then(() => {
      const index = state.tasks.findIndex(task => task.id == taskId)
      commit('DELETE_TASK', index)
      
      window.VEvent.fire('loaderEnd', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_DELETE
      });
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_DELETE_TASK_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },

  async moveTask({ commit }, {tasksListId, taskId, newPosition}) {
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_MOVE
    });
  
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
      methodName: 'moveTask',
      parameters: [tasksListId, taskId, newPosition]
    })
    .then(task => {
      actions.transformTask(task);
      commit('UPDATE_TASK', task)

      window.VEvent.fire('loaderEnd', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_MOVE
      });
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_MOVE_TASK_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },

  async addComment({ commit }, {ametysObjectId, text, authorURL}) {
    return new Promise(function(resolve, reject)
    {
      window.VEvent.fire('loaderStart', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_COMMENT_ADD
      });
    
      callMethod({
        role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
        methodName: 'commentTask',
        parameters: [ametysObjectId, text, authorURL]
      })
      .then(task => {
        actions.transformTask(task);
        commit('UPDATE_TASK', task);

        resolve({comments: task.comments});
        
        window.VEvent.fire('loaderEnd', {
          text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_COMMENT_ADD
        });
      })
      .catch(error => {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_COMMENT_TASK_ERROR_MSG,
            text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
            details: error
        });
        reject();
      })
    });
  },
  
  async editComment({ commit }, {ametysObjectId, commentId, text}) {
    return new Promise(function(resolve, reject)
    {
      window.VEvent.fire('loaderStart', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_COMMENT_EDITED
      });
    
      callMethod({
        role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
        methodName: 'editCommentTask',
        parameters: [ametysObjectId, commentId, text]
      })
      .then(task => {
        actions.transformTask(task);
        commit('UPDATE_TASK', task);

        resolve({comments: task.comments});
        
        window.VEvent.fire('loaderEnd', {
          text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_COMMENT_EDITED
        });
      })
      .catch(error => {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_EDIT_COMMENT_TASK_ERROR_MSG,
            text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
            details: error
        });
        reject();
      })
    });
  },

  async addSubComment({ commit }, {ametysObjectId, commentId, text, authorURL}) {
    return new Promise(function(resolve, reject)
    {
      window.VEvent.fire('loaderStart', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_COMMENT_ADD
      });
    
      callMethod({
        role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
        methodName: 'answerCommentTask',
        parameters: [ametysObjectId, commentId, text, authorURL]
      })
      .then(task => {
        actions.transformTask(task);
        commit('UPDATE_TASK', task);

        resolve({comments: task.comments});
        
        window.VEvent.fire('loaderEnd', {
          text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_COMMENT_ADD
        });
      })
      .catch(error => {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_COMMENT_TASK_ERROR_MSG,
            text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
            details: error
        });
        reject();
      })
    });
  },

  async likeOrUnlikeComment({ commit }, {ametysObjectId, commentId, liked}) {
    return new Promise(function(resolve, reject)
    {
      window.VEvent.fire('loaderStart', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_COMMENT_LIKE
      });
    
      callMethod({
        role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
        methodName: 'likeOrUnlikeCommentTask',
        parameters: [ametysObjectId, commentId, liked]
      })
      .then(task => {
        actions.transformTask(task);
        commit('UPDATE_TASK', task);

        resolve({comments: task.comments});
        
        window.VEvent.fire('loaderEnd', {
          text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_COMMENT_LIKE
        });
      })
      .catch(error => {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_REACT_COMMENT_TASK_ERROR_MSG,
            text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
            details: error
        });
        reject();
      })
    });
  },

  async deleteComment({ commit }, {ametysObjectId, commentId}) {
    return new Promise(function(resolve, reject)
    {
      window.VEvent.fire('loaderStart', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_BEGIN_COMMENT_DELETE
      });
    
      callMethod({
        role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTaskDAO',
        methodName: 'deleteCommentTask',
        parameters: [ametysObjectId, commentId]
      })
      .then(task => {
        actions.transformTask(task);
        commit('UPDATE_TASK', task);

        resolve({comments: task.comments});
        
        window.VEvent.fire('loaderEnd', {
          text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASK_LOADING_END_COMMENT_DELETE
        });
      })
      .catch(error => {
        window.VEvent.fire('loaderFail', { 
            title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_DELETE_COMMENT_TASK_ERROR_MSG,
            text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
            details: error
        });
        reject();
      })
    });
  },

  transformTask(task) {
    this.transformMembers(task);

    for (let com of task.comments)
    {
      this.transformComment(com);
    }
  },

  transformMembers(task) {
    if (task.assignments)
    {
      task.assignments = task.assignments.map(transformToMember);
    }
  },

  transformComment(comment) {
    let users = comment.userLikes;
    let currentUserId = window.ametysUser.login + "#" + window.ametysUser.populationId;
    comment.isLiked = users ? users.indexOf(currentUserId) != -1 : false;
    comment.canHandle = comment.author ? comment.author.id === currentUserId : false;
    for (let com of comment.subComments)
    {
      this.transformComment(com);
    }
  }
}
