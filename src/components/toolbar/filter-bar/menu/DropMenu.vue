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
  <v-menu offset-y
          left
          min-width="75%"
          attach=".ametys-toolbar"
          nudge-bottom="5px"
          v-model="menu"
  >
    <!-- Activator -->
    <template v-slot:activator="{ on }">
      <v-btn class="rounded-l-0 px-0"
             x-large
             min-width="60"
             depressed
             color="rgba(149,117,205,0.1)"
             v-on="on"
             v-ripple="{ class: 'primary--text' }"
      >
        <v-icon v-if="!menu"
                color="primary"
                size="18px"
        >
          fa fa-caret-down
        </v-icon>
        <v-icon v-else
                color="primary"
                size="18px"
        >
          fa fa-caret-up
        </v-icon>
      </v-btn>
    </template>
    <!-- End Activator -->
    <!-- List -->
    <menu-list>
      <slot></slot>
    </menu-list>
    <!-- End List -->
  </v-menu>
</template>

<script>
  import MenuList from './MenuList';
  export default {
    name: "DropMenu",
    components: {MenuList},
    props: {
      menuItems: {
        type: Array,
        requied: true
      }
    },
    data() {
      return {
        menu: false
      }
    }
  }
</script>