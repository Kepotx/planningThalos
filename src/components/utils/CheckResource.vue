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
  <div v-if="!item.available" :key="'unavailable'" class="d-flex align-center subtitle-2 error--text">
    <v-icon size="18" class="mr-2" color="error">close</v-icon>
    {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_UNAVAILABLE_RESOURCE}}
  </div>

  <div v-else :key="'available'" class="d-flex align-center subtitle-2 success--text">
    <v-icon size="18" class="mr-2" color="success">check</v-icon>
    {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_AVAILABLE_RESOURCE}}
  </div>
</template>

<script>

import i18n from '../MessageFrench';

export default {
  name: 'CheckResource',
  props: {
    item: {
      required: true,
      default: Object,
    },
  },
  data() {
      return {
          i18n: i18n,
      }
  }
}
</script>
