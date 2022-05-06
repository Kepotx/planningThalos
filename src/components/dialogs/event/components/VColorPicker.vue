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
  <div>
    <div class="vcolor-picker">
      <div
        v-for="(color, index) in colors"
        :key="index"
        class="vcolor-picker__color"
        :style="{ backgroundColor: color.bg }"
        @click="selectColor(index)"
      >
        <v-icon
          small
          v-if="value && typeof value == 'string' ? index == value : false"
          :dark="colorContrastIsWhite(color.bg)"
          >$success</v-icon
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
    },
    colors: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    selectColor(value) {
      if(this.value != value) this.$emit('input', value)
    },
    colorContrastIsWhite(color) {
      const rgb = this.hexToRgb(color)

      if (!rgb || typeof rgb != 'object') return true
      return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 <= 186
    },
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null
    },
  },
}
</script>

<style lang="scss" scoped>
.vcolor-picker {
  display: flex;
  flex-wrap: wrap;
  &__color {
    position: relative;
    height: 18px;
    max-height: 18px;
    width: 45px;
    margin: 2px 4px;
    border-radius: 2px;
    overflow: hidden;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
