/*
 *  Copyright 2021 Anyware Services
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

export const namespaced = true;
export const state = {
  colors: []
};

export const mutations = {
  SET_COLORS(state, colors) {
    state.colors = colors;
  }
};

export const getters = {
  getColors: state => {
    return state.colors;
  }
}

export const actions = {
    async loadColors({ commit/*, state*/ }) {
        try
        {
            let data = await callMethod({
                role: "org.ametys.plugins.workspaces.tags.ProjectTagsColorsComponent",
                methodName: "getColors",
                parameters: []
            })
            
            commit('SET_COLORS', data);
        }
        catch (e)
        {
            window.VEvent.fire('loaderFail', {
                title: "i18n.PLUGINS_WORKSPACES_PROJECT_LOADCOLORS_FAIL",
                text : "i18n.PLUGINS_WORKSPACES_PROJECT_LOADCOLORS_FAIL_TEXT",
                details: e
            });
    
        }
    }
}
