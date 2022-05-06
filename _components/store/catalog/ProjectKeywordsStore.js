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
import { callMethod } from '../../helper/ServerCommHelper';
import i18n from 'i18n';

export const namespaced = true;
export const state = {
  keywords: [],
  canCreate: false
};

export const mutations = {
  SET_CREATE(state, canCreate) {
    state.canCreate = canCreate;
  },
  SET_KEYWORDS(state, keywords) {
    state.keywords = keywords;
  },
  ADD_KEYWORDS(state, keywords) {
    for (var i in keywords)
    {
        state.keywords.push(keywords[i]);
    }
  }
};

export const getters = {
  getKeywords: state => {
    return state.keywords;
  },
  canCreate: state => {
    return state.canCreate;
  }
}

export const actions = {
    async loadKeywords({ commit/*, state*/ }) {
        try
        {
            let data = await callMethod({
                role: "org.ametys.plugins.workspaces.keywords.KeywordsDAO",
                methodName: "getKeywords",
                parameters: []
            })
            
            data.keywords.sort(function(c1,c2) {
                if (c1.text == c2.text) return 0;
                else if (c1.text < c2.text) return -1;
                else return 1;
            });
            
            commit('SET_KEYWORDS', data.keywords);
            commit('SET_CREATE', data.canCreate);
        }
        catch (e)
        {
            window.VEvent.fire('loaderFail', {
                title: i18n.PLUGINS_WORKSPACES_CATALOGUE_LOADKEYWORDS_FAIL,
                text : i18n.PLUGINS_WORKSPACES_CATALOGUE_LOADKEYWORDS_FAIL_TEXT,
                details: e
            });
    
        }
    }
}
