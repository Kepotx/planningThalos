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
export const namespaced = true;
export const state = {
  info: false,
  item: {}
};

export const mutations = {
  SET_INFO(state, info) {
    state.info = info;
  },
  SET_ITEM(state, item) {
    state.item = item;
  }
};

export const getters = {
  item: state => {
    if (state.item && state.item.type !== 'folder') {
      return state.item.id;
    } else {
      return false;
    }
  }
}

export const actions = {
  setItem({ commit, dispatch }, payload) {
     commit('SET_ITEM', payload.item);

     if (payload.item.type == 'file') {
        commit('activity/SET_LOAD_BY', 4, {root: true});
        dispatch('activity/loadActivity', payload.item, {root: true})
        dispatch('comments/loadComments', payload.item, {root: true})

        if (payload.commenter) {
          window.VEvent.fire('commenter')
        } else {
          window.VEvent.fire('preview')
        }
      }
      if (!payload.notOpen) {
        commit('SET_INFO', true);
      }
  }
}
