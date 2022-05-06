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
  <v-tooltip :disabled="!isTruncated" top open-delay="500">
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot name="prepend"></slot>
        <span :class="['js-text-truncated', {'text-truncate-dots': isTruncated}]"></span>
      </div>
    </template>

    {{text}}
  </v-tooltip>
</template>

<script>
  export default {
    name: 'TextTruncate',

    props: {
      text: {
        type: String,
        default: ''
      },
      height: {
        type: Number,
        default: 56
      }
    },

    data() {
      return {
        isMounted: false,
        isTruncated: false,
        el: null
      }
    },

    watch: {
      text() {
        this.setText()
        this.isRemoveTruncaate()
        this.truncate()
      }
    },

    methods: {
      setText() {
        this.el.textContent = this.text
      },

      isRemoveTruncaate() {
        if (this.el.offsetHeight < this.height) {
          this.isTruncated = false
        }
      },

      truncate() {
        let text = this.el.textContent.split(" ")

        if (this.el.offsetHeight > this.height) {
          this.isTruncated = true
          while(this.el.offsetHeight > this.height) {
            text = this.el.textContent.split(" ")
            text.pop()
            text = text.join(" ")
            this.el.textContent = text
          }
        }
      }
    },

    mounted() {
      this.el = this.$parent.$el.querySelector('.js-text-truncated')
      this.setText()

      setTimeout(() => {
        this.isMounted = true
        if (this.isMounted && this.el) {
          this.truncate()
        }
      }, 100)
    }

  }
</script>