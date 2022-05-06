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
//import Vue from 'vue';
//import AmetysFront from 'AmetysFront';
import { callMethod } from '../../helper/ServerCommHelper';
//import {transformToMember} from "../../helper/MemberHelper";
import i18n from 'i18n';
import AmetysUtils from 'AmetysUtils';

export const namespaced = true;
export const state = {
  myProjects: [],
  pubProjects: [],
  menuProjects: [],
  categories: [],
  type: 'getMyProjects',
  isLoaded: false,
  canCreate: false,
  canCreatePrivateProject: false,
  canCreatePublicProjectWithModeration: false,
  canCreatePublicProject: false,
  users: []
};

export const mutations = {
  SET_MY_PROJETS(state, projects) {
    state.myProjects = projects;
  },
  CREATE_PROJECT(state, payload) {
    if (payload.managers.map(m => m.login + '#' + m.populationId).indexOf(window.ametysUser.login + '#' + window.ametysUser.populationId) == -1)
    {
        // I'm not part of the new project, public or not ?
        if (payload.visibility != 1)
        {
            state.pubProjects.push(payload);
        }
        else
        {
            // A new project, I cannot see..
        }
    }
    else
    {
        // My new project => adding, redirecting
        state.myProjects.push(payload);
        window.location.href = payload.url;
        payload.redirected = true;
    }
  },
  EDIT_PROJECT(state, payload) {
    var project = state.myProjects[payload.index];
    
    for (let c in payload)
    {
        if (payload.hasOwnProperty(c))
        {
            project[c] = payload[c];
        }
    }
  },
  DELETE_PROJECT(state, payload) {
    state.myProjects.splice(payload.index, 1);
  },
  SET_PUB_PROJETS(state, projects) {
    state.pubProjects = projects;
  },
  SET_MENU_PROJETS(state, projects) {
    state.menuProjects = projects;
  },
  SET_TYPE(state, type) {
    state.type = type;
  },
  SET_CATEGORIES(state) {
    function pushIfNotExist(categories, category)
    {
        if (category)
        {
            for (let i = 0; i < categories.length; i++)
            {
                if (categories[i].name == category.name)
                {
                    return;
                }
            }
            categories.push(category);
        }
    }
    
    var rootCategories = this.state.rootCategories;
    function _getRoot(category)
    {
        return category ? { color: "#000", ...rootCategories[category.name]} : null;
    }
    
    let categories = [];
    state.myProjects.forEach(p => pushIfNotExist(categories, _getRoot(p.category)));
    state.pubProjects.forEach(p => pushIfNotExist(categories, _getRoot(p.category)));
    categories.sort(function(c1,c2) {
        if (c1.title == c2.title) return 0;
        else if (c1.title < c2.title) return -1;
        else return 1;
    });

    state.categories = categories;
  },
  SET_LOADER(state, isLoaded) {
    state.isLoaded = isLoaded;
  },
  SET_CANCREATE(state, data) {
    state.canCreate = data.canCreate;
    state.canCreatePrivateProject = data.canCreatePrivateProject;
    state.canCreatePublicProjectWithModeration = data.canCreatePublicProjectWithModeration;
    state.canCreatePublicProject = data.canCreatePublicProject;
  },
  SET_USERS(state, users) {
    state.users = users
  }
};

export const getters = {
  getMenuProjects: state => {
    return state.menuProjects;
  },
  getMyProjects: state => {
    return state.myProjects;
  },
  getPubProjects: state => {
    return state.pubProjects;
  },
  getTypeProject: state => {
    return state.type;
  },
  getCategoriesProjects: state => {
    return state.categories;
  },
  getUsers: state => {
    return state.users;
  },  
  getProjects: (state, getters, rootState) => {
    var rootCategories = rootState.rootCategories;
    if (state.type == 'getMyProjects') {
      return state.myProjects.filter(project => {
        return AmetysUtils.deemphasize(project.title.toLowerCase()).indexOf(AmetysUtils.deemphasize(rootState.filters.byName.toLowerCase())) !== -1 && (project.category ? rootCategories[project.category.name].name.indexOf(rootState.filters.byCategory) !== -1 : true)
      })
    } else {
      return state.pubProjects.filter(project => {
        return AmetysUtils.deemphasize(project.title.toLowerCase()).indexOf(AmetysUtils.deemphasize(rootState.filters.byName.toLowerCase())) !== -1 && (project.category ? rootCategories[project.category.name].name.indexOf(rootState.filters.byCategory) !== -1 : true)
      }).sort(function(x, y){
        if (x.title < y.title) return -1
        if (x.title > y.title) return 1
        return 0;
      })

    }
  }
}

export const actions = {
  async setType({ commit/*, state*/ }, type) {
    commit('SET_TYPE', type);
  },
  
  async loadProjects({ commit/*, state*/ }) {
    try
    {
        let data = await callMethod({
          role: 'org.ametys.plugins.workspaces.project.ProjectsCatalogueManager',
          methodName: 'getUserAndPublicProjects'
        });
        commit('SET_PUB_PROJETS', data.availablePublicProjects);
        commit('SET_MY_PROJETS', data.userProjects);
        commit('SET_LOADER', true);
        commit('SET_CANCREATE', data);
        commit('SET_CATEGORIES', '');
    }
    catch (e)
    {
        window.VEvent.fire('loaderFail', {
            title: i18n.PLUGINS_WORKSPACES_CATALOGUE_LOADPROJECT_FAIL,
            text : i18n.PLUGINS_WORKSPACES_CATALOGUE_LOADPROJECT_FAIL_TEXT,
            details: e
        });

    }
  },
  async loadMembers({commit/*, rootState*/}, options) {
    let {users} = await callMethod({
      role: 'org.ametys.plugins.workspaces.user.UserComponent',
      methodName: 'getUsers',
      parameters: [options.sitename, options.count, options.paginateOffset, options.search]
    })

    users = users.map(user => {
      return {
        ...user,
        text: 'asd'
      }
    })

    commit('SET_USERS', users)
  },
  
  /**
   * Creates a new project of edit an existing one
   */
  async createOrEditProject({commit, state}, payload) {
    window.VEvent.fire('loaderStart', {
        text: payload.id ? i18n.PLUGINS_WORKSPACES_CATALOGUE_EDITPROJECT_RUNNING
                         : i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECT_RUNNING
    });

    var parameters;
    
    if (payload.id) // edit
    {
        parameters = [
            payload.id,
            payload.title,
            payload.description,
            payload.illustration,
            payload.category,
            payload.keywords,
            payload.visibility,
            payload.defaultProfile,
            payload.managers,
            payload.modules
        ];
    }
    else // create
    {
        parameters = [
            payload.zoneitemId,
            payload.title,
            payload.description,
            payload.illustration,
            payload.category,
            payload.keywords,
            payload.visibility,
            payload.defaultProfile,
            payload.language,
            payload.managers,
            payload.modules
        ];
    }

    try
    {
        let result = await callMethod({
           role: 'org.ametys.plugins.workspaces.project.ProjectsCatalogueManager',
           methodName: payload.id ? 'editProject': 'createProject',
           parameters: parameters
        })
        if (result.success)
        {
            if (payload.id)
            {
                let index = state.myProjects.findIndex(p => p.id == payload.id);
                commit('EDIT_PROJECT', {index: index, 
                                        ...result.project});
                commit('SET_CATEGORIES', '');
                commit('projectKeywords/ADD_KEYWORDS', result.keywords, { root: true })
            }
            else
            {
                commit('CREATE_PROJECT', result.project);
                commit('SET_CATEGORIES', '');
                commit('projectKeywords/ADD_KEYWORDS', result.keywords, { root: true })
            }
            
            window.VEvent.fire('loaderEnd', {
                text: payload.id ? i18n.PLUGINS_WORKSPACES_CATALOGUE_EDITPROJECT_DONE
                                 : (payload.redirected ? i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECT_DONEREDIRECTION : i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECT_DONE)
            });
        }
        else  {
            window.VEvent.fire('loaderFail', {
                title: (payload.id ? i18n.PLUGINS_WORKSPACES_CATALOGUE_EDITPROJECT_FAIL
                                     : i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECT_FAIL ),
                text : (payload.id ? i18n.PLUGINS_WORKSPACES_CATALOGUE_EDITPROJECT_FAIL_TEXT
                                     : i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECT_FAIL_TEXT ),
                details: null
            });
        }
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', { 
            title: (payload.id ? i18n.PLUGINS_WORKSPACES_CATALOGUE_EDITPROJECT_FAIL
                                 : i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECT_FAIL ),
            text : (payload.id ? i18n.PLUGINS_WORKSPACES_CATALOGUE_EDITPROJECT_FAIL_TEXT
                                 : i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECT_FAIL_TEXT ),
            details: null
        });
    }
  },
  /**
   * Delete a project
   */
  async deleteProject({ commit, state/*, dispatch*/}, payload) {
    
    window.VEvent.fire('loaderStart', {
        text: i18n.PLUGINS_WORKSPACES_CATALOGUE_DELETEPROJECT_RUNNING
    });

    try
    {
        let result = await callMethod({
           role: 'org.ametys.plugins.workspaces.project.ProjectsCatalogueManager',
           methodName: 'deleteProject',
          parameters: [payload.id]
        });
    
        if (result.success)
        {
            let index = state.myProjects.findIndex(p => p.id == payload.id);
            commit('DELETE_PROJECT', {index: index});
            
          window.VEvent.fire('loaderEnd', {
            text: i18n.PLUGINS_WORKSPACES_CATALOGUE_DELETEPROJECT_DONE
          });
        }
        else  
        {
            window.VEvent.fire('loaderFail', {
                title: i18n.PLUGINS_WORKSPACES_CATALOGUE_DELETEPROJECT_FAIL,
                text: i18n.PLUGINS_WORKSPACES_CATALOGUE_DELETEPROJECT_FAIL_TEXT,
                details: null
            });
        }
    }
    catch(e)
    {
        window.VEvent.fire('loaderFail', {
            title: i18n.PLUGINS_WORKSPACES_CATALOGUE_DELETEPROJECT_FAIL,
            text: i18n.PLUGINS_WORKSPACES_CATALOGUE_DELETEPROJECT_FAIL_TEXT,
            details: null
        });
    }
  },  
}
