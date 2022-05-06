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
import $j from 'jQuery';

export const namespaced = true;
export const state = {
  tabs: [],
  activeTab: null,
  initialized: false,
};

export const mutations = {
  SET_TABS(state, tabs) {
    state.tabs = tabs;
  },
  SET_ACTIVE_TAB(state, tab) {
    state.activeTab = tab;
  }
};

export const actions = {
  
  setTabs({ commit, /*state,*/ dispatch}) {

    let tabs = [];

    $j('*[data-ametys-mobile-tab]').each(function(i, el) {
      let $this = $j(el),
        $isEmpty = $this.children().length == 0,
        $id = $this.attr('id'),
        $alert = $this.data('ametys-mobile-tab-alert'),
        $text = $this.data('ametys-mobile-tab-text'),
        $priority = Number($this.data('ametys-mobile-tab-priority')) || 10;

      if (!$isEmpty) {
        if($id && $text) {
          tabs.push({text: $text, selector: '#' + $id, alert: $alert, priority: $priority});
        }
        else {
          window.console.error("Missing 'id' and/or 'ametys-mobile-tab-text' attribute for tab. It will be ignored");
        }
      }
    });
    
    // sort tabs by priority
    tabs.sort(function(t1, t2){
        if (t1.priority < t2.priority){
          return -1;
        }
        if (t1.priority > t2.priority){
          return 1;
        }
        return 0;
    });

    commit('SET_TABS', tabs);

    // select first tab
    dispatch('selectTab', tabs[0]);
    commit('SET_ACTIVE_TAB', 0);
  },

  selectTab({ /*commit, */state/*, dispatch*/}, tab) {
    
    tab = tab || state.tabs[state.activeTab] || state.tabs[0];
    
    if (tab && window.innerWidth < 600) {
      let tabsToHide = state.tabs.filter(e => e.selector != tab.selector);
      tabsToHide.forEach(e => $j(e.selector).hide());
      $j(tab.selector).show();
    }
  },
  
  unselectTabs({ commit, state/*, dispatch*/}) {
    state.tabs.forEach(e => $j(e.selector).show());
    commit('SET_ACTIVE_TAB', 0); // reset active tab
  }
}