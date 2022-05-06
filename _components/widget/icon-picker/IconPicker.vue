<!--
   Copyright 2022 Anyware Services

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
  <v-combobox
    :value="value"
    :label="label"
    :items="[]"
    :menu-props="{ offsetY: true, maxWidth: 'min-content', value: isOpened }"
    @click:clear="$emit('input', '')"
    :error="error"
    :clearable="clearable"
    :rules="rules"
    @update:search-input="handleSearch"
    class="input-field__pointer"
    ref="iconPicker"
  >
    <template v-slot:selection>
      <template v-if="!isOpened">
        <v-icon>{{ value }}</v-icon>
        <span class="ml-2">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ICON_SELECTED}}</span>
      </template>
    </template>

    <template v-slot:no-data>
      <template v-if="iconLists.length > 0">
        <div :key="k" v-for="(v, k) in iconLists" class="p-2">
          <div class="text--secondary mb-2 pl-2">{{ v.name }}</div>
          <div class="w-100">
            <v-btn
              v-for="(i, idx) in v.icons"
              :key="k + '_' + idx"
              icon
              @click="handleIconClick(i)"
              :color="(value === i && 'primary') || ''"
              :style="{ backgroundColor: value === i ? '#f2f3f8' : '' }"
            >
              <v-icon>{{ i }}</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="p-2">
          <div class="text--secondary">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_NO_DATA_AVAILABLE}}</div>
        </div>
      </template>
    </template>
  </v-combobox>
</template>
<script>
import i18n from '../../../src/components/MessageFrench';
export default {
  props: {
    label: {
      type: String,
      default: 'Icon',
    },
    value: {
      type: String,
      default: '',
    },
    error: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
      default: () => [],
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [
      ],
    },
  },
  data() {
    return {
        i18n: i18n,
        query: '',
        isOpened: false,
    }
  },
  mounted() {
    this.handleComponentLogics()
  },
  computed: {
    iconLists() {
      const data = []

      for (const l of this.list) {
        const icons = l.icons.filter((i) => i.toLowerCase().includes(this.query.toLowerCase()))
        if (icons.length > 0) data.push({ ...l, ...{ icons } })
      }

      return data
    },
  },

  methods: {
    handleComponentLogics() {
      this.$watch('$refs.iconPicker.isFocused', (newVal/*, oldVal*/) => {
        this.toggleMenu(newVal)
      })

      this.$watch('$refs.iconPicker.isMenuActive', (newVal/*, oldVal*/) => {
        this.isOpened = newVal
      })

      this.preventEnterKeyDown()
    },
    handleSearch(v) {
      this.query = v || ''
      this.preventEnterKeyDown()
    },

    handleIconClick(i) {
      this.$emit('input', i)
      this.toggleMenu(false)
    },

    toggleMenu(val) {
      this.isOpened = val
      const component = this.$refs.iconPicker
      if (component) {
        component.isMenuActive = val
        component.isFocused = val
      }
    },

    preventEnterKeyDown() {
      const component = this.$refs.iconPicker
      if (component) {
        /* Set VMenu's listIndex to positive number to prevent updating value when "Enter" key pressed */
        const vmenu = component.$children.find((child) => child.$options.name === 'v-menu')
        if (vmenu) vmenu.listIndex = 1
      }
    },
  },
}
</script>
