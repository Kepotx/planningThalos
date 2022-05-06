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
import i18n from 'i18n';
import { callMethod } from '../../helper/ServerCommHelper';

export const namespaced = true;

export const state = {
  tasksLists: []
};

export const mutations = {
  SET_TASKSLISTS(state, tasksLists) {
    state.tasksLists = tasksLists;
  },
  ADD_TASKLIST(state, tasksList) {
    state.tasksLists.push(tasksList);
  },
  DELETE_TASKLIST(state, index) {
    state.tasksLists.splice(index, 1);
  },
  UPDATE_TASKLIST(state, editedTasksList) {
    const index = state.tasksLists.findIndex(tasksList => tasksList.id === editedTasksList.id)

    if (index !== -1) {
      state.tasksLists.splice(index, 1, editedTasksList)
    }
  }
};

export const getters = {
  getTasksLists: (state) => {
    return state.tasksLists;
  },
}

export const actions = {
  async loadTasksLists({commit}) {
    window.VEvent.fire('loader', true)

    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTasksListDAO',
      methodName: 'getTasksLists',
      parameters: []
    })
    .then(data => {
      commit('SET_TASKSLISTS', data);
      window.VEvent.fire('loader', false)
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_LOAD_TASKS_LIST_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },

  async addTasksList({commit}, {label}) {
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_LOADING_BEGIN_ADD
    });
    
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTasksListDAO',
      methodName: 'addTasksList',
      parameters: [
        label
      ]
    })
    .then(data => {
      commit('ADD_TASKLIST', {id: data.id, label: label});
      
      window.VEvent.fire('loaderEnd', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_LOADING_END_ADD
      });
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },

  async deleteTasksList({commit, state}, {id}) {
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_LOADING_BEGIN_DELETE
    });
  
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTasksListDAO',
      methodName: 'deleteTasksList',
      parameters: [
        id
      ]
    })
    .then(() => {
      const index = state.tasksLists.findIndex(tasksList => tasksList.id == id)
      commit('DELETE_TASKLIST', index);
      
      window.VEvent.fire('loaderEnd', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_LOADING_END_DELETE
      });
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_DELETE_TASKS_LIST_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },

  async editTasksList({commit}, {id, newLabel}) {
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_LOADING_BEGIN_EDIT
    });
  
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTasksListDAO',
      methodName: 'editTasksList',
      parameters: [
        id,
        newLabel
      ]
    })
    .then(data => {
      commit('UPDATE_TASKLIST', {id: data.id, label: newLabel});
      
      window.VEvent.fire('loaderEnd', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_LOADING_END_EDIT
      });
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_EDIT_TASKS_LIST_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  },
  
  async moveTasksList({commit}, {id, newPosition}) {
    window.VEvent.fire('loaderStart', {
      text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_LOADING_BEGIN_MOVE
    });
  
    await callMethod({
      role: 'org.ametys.plugins.workspaces.tasks.WorkspaceTasksListDAO',
      methodName: 'moveTasksList',
      parameters: [
        id,
        newPosition
      ]
    })
    .then(data => {
      commit('UPDATE_TASKLIST', {id: data.id, position: newPosition});
      
      window.VEvent.fire('loaderEnd', {
        text: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_ADD_TASKS_LIST_LOADING_END_MOVE
      });
    })
    .catch(error => {
      window.VEvent.fire('loaderFail', { 
          title: i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_MOVE_TASKS_LIST_ERROR_MSG,
          text : i18n.PLUGINS_WORKSPACES_PROJECT_MODULE_TASKS_GENERAL_ERROR_TEXT,
          details: error
      });
    })
  }
}
