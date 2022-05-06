<!--
   Copyright 2020 Anyware Services

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   -->
<template>
  <v-menu v-bind="$attrs">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <slot></slot>
      </div>
    </template>

    <v-list dense
            class="ametys-dropdown">
      <slot name="items"></slot>
    </v-list>
  </v-menu>
</template>

<script>
  export default {
    name: "AmetysDropdown"
  }
</script>

<style lang="scss">
  .ametys-dropdown-invoker .v-btn__content {
    position: relative;
    z-index: 1000;
  }

  .ametys-dropdown {
    padding: 60px 11px 25px 11px;
  }
</style>