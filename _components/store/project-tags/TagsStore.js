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
  tags: [],
  canCreate: false
};

export const mutations = {
  SET_CREATE(state, canCreate) {
    state.canCreate = canCreate;
  },
  SET_TAGS(state, tags) {
    state.tags = tags;
  },
  ADD_TAGS(state, tags) {
    for (var i in tags)
    {
        state.tags.push(tags[i]);
    }

    state.tags.sort(function(c1,c2) {
        if (c1.text.toLowerCase() == c2.text.toLowerCase()) return 0;
        else if (c1.text.toLowerCase() < c2.text.toLowerCase()) return -1;
        else return 1;
    });
  }
};

export const getters = {
  getTags: state => {
    return state.tags;
  },
  canCreate: state => {
    return state.canCreate;
  }
}

export const actions = {
    async loadTags({ commit/*, state*/ }) {
        try
        {
            let data = await callMethod({
                role: "org.ametys.plugins.workspaces.tags.ProjectTagsDAO",
                methodName: "getProjectTags",
                parameters: []
            })

            data.tags.sort(function(c1,c2) {
                if (c1.text.toLowerCase() == c2.text.toLowerCase()) return 0;
                else if (c1.text.toLowerCase() < c2.text.toLowerCase()) return -1;
                else return 1;
            });

            commit('SET_TAGS', data.tags);
            commit('SET_CREATE', data.canCreate);
        }
        catch (e)
        {
            window.VEvent.fire('loaderFail', {
                title: "i18n.PLUGINS_WORKSPACES_PROJECT_LOADTAGS_FAIL",
                text : "i18n.PLUGINS_WORKSPACES_PROJECT_LOADTAGS_FAIL_TEXT",
                details: e
            });

        }
    }
}
