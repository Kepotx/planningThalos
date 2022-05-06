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
  <v-list-item class="d-flex align-center ametys-dropdown-item">
    <v-icon size="16" class="mr-4">{{icon}}</v-icon> {{text}}
  </v-list-item>
</template>

<script>
  export default {
    name: "AmetysDropdown",
    props: {
      icon: {
        type: String,
        default: null
      },
      text: {
        type: String,
        required: true
      }
    }
  }
</script>

<style lang="scss">
  .ametys-dropdown-item {
    font-size: 14px;
    min-height: 37px;

    &:hover {
      cursor: pointer;
    }
  }
</style>