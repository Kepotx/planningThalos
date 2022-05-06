/*
 *  Copyright 2020 Anyware Services
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
import { callMethod } from '../helper/ServerCommHelper';

export const namespaced = true;
export const state = {
  userProjects: []
};

export const mutations = {
  SET_USER_PROJETS(state, projects) {
    state.userProjects = projects;
  }
};

export const getters = {
  /**
   * Get the user's projets
   */
  getUserProjects: state => {
    return state.userProjects;
  }
}

export const actions = {

  async loadUserProjects({ commit/*, state*/ }) {

    const projects = await callMethod({
      role: 'org.ametys.plugins.workspaces.project.ProjectManager',
      methodName: 'getUserProjectsData'
    });

    commit('SET_USER_PROJETS', projects);
  }
}