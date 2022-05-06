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
  <v-card class="ametys-toolbar d-flex align-center px-5"
          width="785"
          height="86px"
  >
    <!-- Button -->
    <slot name="button"></slot>
    <!-- End Button -->

    <!-- Icon -->
    <v-icon class="filter-icon rounded-l rounded-r-0"
            color="primary"
            size="28"
    >
      mdi-filter-variant
    </v-icon>
    <!-- End Icon -->

    <div class="w-100 position-relative" @click="toggleDropDownMenu">
       <!-- Input -->
      <input-filter @searched="$emit('searched')"/>
      <!-- End Input -->

      <!-- Category Chip -->
      <input-chip v-if="isFilterByCategory"
                  v-slot="{selectedItem}"
                  @reset="$emit('reset-calendar')"
                  class="category-chip"
      >
        <slot name="chip-item" v-bind:selectedItem="selectedItem"></slot>
      </input-chip>
      <!-- End Category Chip -->

      <!-- Resource Calendar Chip -->
      <input-chip v-if="calendarType == 'resources' && isResourceCalendar"
                  @reset="$emit('reset-resource-calendar')"
                  class="category-chip"
      >
         <slot name="chip-item" v-bind:selectedItem="resourceCalendar"></slot>
      </input-chip>
      <!-- End Resource Calendar Chip -->
    </div>

    <!-- Menu -->
    <drop-menu v-if="showMenuBtn"
               ref="dropdown-calendar-menu"
    >
      <slot name="menu"></slot>
    </drop-menu>
    <!-- End Menu -->
  </v-card>
</template>

<script>
  import {mapGetters} from 'vuex'
  import DropMenu from './menu/DropMenu';
  import InputFilter from './input/InputFilter';
  import InputChip from './input/InputChip';
  export default {
    name: "FilterBar",
    components: {DropMenu, InputChip, InputFilter},
    props: {
      showMenuBtn: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapGetters({
        isFilterByCategory: 'filters/isFilterByCategory',
        calendarType: 'calendars/getCalendarType',
        resourceCalendar: 'calendars/resourceCalendar',
        isResourceCalendar: 'filters/isResourceCalendar',
      })
    },
    methods: {
      toggleDropDownMenu() {
        const el = this.$refs['dropdown-calendar-menu'];
        if(el) el.menu = !el.menu;
      }
    },
  }
</script>

<style lang="scss">
  .ametys-toolbar {
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.15) !important;
    z-index: 2;

    .filter-icon {
      height: 52px;
      background-color: rgba(149, 117, 205, 0.1);
      padding-left: 15px;
    }
  }
</style>
<style lang="scss" scoped>
.category-chip{
  position: absolute;
  top: 0;
  background-color: transparent;
}
</style>
