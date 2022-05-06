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
  <div class="d-flex align-center filter-combobox">
    <v-chip close
            @click:close="resetFilters"
    >
      <slot v-bind:selectedItem="selectedItem"></slot>
    </v-chip>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "InputChip",
    computed: {
      ...mapState({
        selectedItem: state => state.filters.chip
      })
    },
    methods: {
      resetFilters() {
        this.$emit('reset')
      }
    }
  }
</script>

<style scoped>
  .filter-combobox {
    height: 52px;
    background-color: rgba(149, 117, 205, 0.1);
    padding: 0 12px;
  }
</style>