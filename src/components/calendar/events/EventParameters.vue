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
  <a href="javascript:;"
     class="d-flex align-center link-muted text-decoration-none font-weight-medium my-4"
     @click="openParametersDialog">
    <v-icon size="16"
            class="mr-2"
    >
      fa fa-cog
    </v-icon>
    {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_SETTINGS_MENU}}
  </a>
</template>

<script>
import i18n from '../../MessageFrench';
  export default {
    name: "EventParameters",
    methods: {
      openParametersDialog() {
        window.VEvent.fire('open-parameters-dialog');
      }
    },
    data() {
        return {
          i18n
        }
      },
  }
</script>
