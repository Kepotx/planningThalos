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
    <div class="toolbar-container">
    <slot
    v-if="!$vuetify.breakpoint.smAndUp ? toolbar : true"
        v-bind:default="toolbar"></slot>
    </div>
</template>

<script>

export default {
  name: "CalendarHeader",

  data() {
    return {
      toolbar: false
    }
  },

  created() {
    window.VEvent.listen('search', displayToolbar => this.toolbar = displayToolbar)
  }
}
</script>

<style lang="scss">
.toggle-toolbar {
  display: none;
}

.kanban-header {
  height: 350px;
  left: 0;
}

@media (max-width: 600px) {

  .kanban-header {
    height: 200px;
  }

  .toggle-toolbar {
    display: block;
  }

  .ametys-toolbar {
    position: relative;
    border-radius: 0 !important;
    top: 5px;
  }
}

@media (min-width: 600px) {
  .ametys-toolbar {
    border-radius: 8px !important;
  }
}
</style>
