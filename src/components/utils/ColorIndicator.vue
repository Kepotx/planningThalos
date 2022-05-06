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
  <span class="event-color-indicator"
        :class="classes"
        :style="styles"
  ></span>
</template>

<script>
  export default {
    name: "ColorIndicator",
    props: {
      color: {
        type: String,
        required: true
      },
      size: {
        type: [String, Number],
        default: 14
      },
      classes:{
        type:String,
        default:'mr-4'
      }
    },
    computed: {
      styles() {
        return {
          backgroundColor: this.color,
          width: this.size.toString() + 'px',
          height: this.size.toString() + 'px'
        }
      }
    }
  }
</script>

<style scoped>
  .event-color-indicator {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
  }
</style>