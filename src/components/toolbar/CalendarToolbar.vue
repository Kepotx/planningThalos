/*
 *  Copyright 2022 Anyware Services
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
<template>
  <filter-bar id="toolbar"  @reset-calendar="unselectCalendar" @reset-resource-calendar="setByResourceCalendar(false)" >
    <!-- Button -->
    <template slot="button">
      <toolbar-button />
    </template>
    <!-- End Button -->

    <!-- Menu Item Content -->
    <!--    <template v-slot:menu-item="{item}">-->
    <!--          <color-indicator :color="item.color" />-->
    <!--          <span class="font-weight-normal subtitle-2" v-text="item.title"></span>-->
    <!--    </template>-->
    <!-- End Menu Item Content -->

    <!-- Menu -->
    <template slot="menu">
      <div class="d-flex flex-wrap justify-space-between align-center px-4 mt-4 mb-1">
        <h5 class="font-weight-normal fsz-14 primary--text mb-0 mr-3">{{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_TOOLBAR_CALENDARS}}</h5>
        <a
          class="fsz-12 font-weight-medium text-decoration-none line-height-1-7 secondary-hover-to-primary"
          href="javascript:;"
          @click="resetCategory"
          >{{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_TOOLBAR_ALL_CALENDARS}}</a
        >
      </div>
      <menu-item
        v-for="(item, index) in calendars"
        :key="index"
        :menu-item="item"
        :active="isCalendarSelected(item)"
      >
          <div class="d-flex align-center w-100 cursor-pointer" @click="isCalendarSelected(item) ? unselectCalendar(item) :selectCalendar(item)">
            <color-indicator :color="item.color.bg" />
            <span class="filter-bar-item-font font-weight-normal" v-text="item.title"></span>
          </div>
      </menu-item>

      <template v-if="calendarType == 'resources'">
        <div class="d-flex flex-wrap justify-space-between align-center px-4 mt-2 mb-1">
          <h5 class="font-weight-normal fsz-14 primary--text mb-0 mr-3">{{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_TOOLBAR_NO_CALENDAR}}</h5>
        </div>
        <v-list-item class="link-muted" :class="{ active: byResourceCalendar }">
          <div class="d-flex align-center w-100 cursor-pointer" @click="setByResourceCalendar(!byResourceCalendar)">
              <color-indicator :color="resourceCalendar.color.bg" />
              <span class="filter-bar-item-font font-weight-normal" >{{ resourceCalendar.title }}</span>
            </div>
        </v-list-item>
      </template>
    </template>
    <!-- End Menu -->

    <!-- Chip Content -->
    <template v-slot:chip-item="{ selectedItem }">
      <i v-if="selectedItem.hasOwnProperty('icon') && selectedItem.icon" :class="selectedItem.icon" class="mr-2"></i>
      <color-indicator v-else-if="selectedItem.color.bg" :color="selectedItem.color.bg" />
      <span class="primary--text mr-2" v-text="selectedItem.title"></span>
    </template>
    <!-- End Chip Content -->
  </filter-bar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import FilterBar from './filter-bar/FilterBar'
import MenuItem from './filter-bar/menu/MenuItem'
import ColorIndicator from '../utils/ColorIndicator'
import ToolbarButton from './ToolbarButton'
import eventsMixin from './../../mixins/eventsMixin'
import i18n from '../MessageFrench';

export default {
  name: 'CalendarToolbar',
  components: { ToolbarButton, ColorIndicator, FilterBar, MenuItem },
  mixins: [eventsMixin],
  data() {
    return {
        i18n,
      selected: false,
    }
  },
  computed: {
    ...mapGetters('calendars', {
      calendarType: 'getCalendarType',
      calendars: 'calendars',
      resourceCalendar: 'resourceCalendar',
    }),
    ...mapState({
      resources: (state) => state.resources.resources,
      filterByCategory: (state) => state.filters.byCategory,
      byResourceCalendar: (state) => state.filters.byResourceCalendar,
    }),
  },
  methods: {
    // Set filter to find by group key
    resetCategory() {
        if (this.byResourceCalendar)
        {
            this.setByResourceCalendar(false);
        }
        else if (Object.prototype.hasOwnProperty.call(this.filterByCategory, 'id'))
        {
            this.$store.dispatch('filters/resetCategory');
        }
      return
      // this.loadEvents()
    },
    setByResourceCalendar(val) {
      if(val == this.byResourceCalendar) return
      this.$store.dispatch('filters/setByResourceCalendar',val)
      // this.loadEvents()
    },
    isCalendarSelected(item) {
      return Object.prototype.hasOwnProperty.call(this.filterByCategory, 'id') && this.filterByCategory.id === item.id
    },
    async selectCalendar(item) {
      await this.$store.dispatch('filters/setByCategory', { ...item, resource: false })
      // this.loadEvents()
    },
    async unselectCalendar(/*item*/) {
      this.resetCategory();
    },
  },
}
</script>
