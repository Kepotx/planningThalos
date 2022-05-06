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
  <v-tooltip top v-if="hideText">
    <template v-slot:activator="{ on }">
      <v-chip small
              style="z-index: 1; margin-left: -6px;"
              v-on="on"
              :class="['hide-content', {'cursor-pointer': !noPointer}]"
              :color="colorClass + '--text lighten-3'"
      >
        <v-icon :color="colorClass" size="12px" left>fa fa-hashtag</v-icon>
      </v-chip>
    </template>
    <span class="text-truncate" style="max-width: 185px;">{{tag.text}}</span>
  </v-tooltip>
  <v-chip v-else
          style="height: 24px;"
          :close="canWrite"
          @click:close="$emit('removeTag')"
          :class="mr-2"
          :color="colorClass + '--text lighten-3'"
  >
    <v-icon :color="colorClass" size="12px" left>fa fa-hashtag</v-icon>
    <span :class="'tag-item ' + colorClass + '--text text--darken-3'" class="text-truncate" style="max-width: 130px;">
      {{tag.text}}
    </span>
  </v-chip>
</template>

<script>
  export default {
    name: "TagItem",
    props: {
      closee: {
        type: Boolean,
        default: false
      },
      noPointer: {
        type: Boolean,
        default: false
      },
      hideText: {
        type: Boolean,
        default: false
      },
      tag: {
        type: Object,
        required: false
      },
      colorClass: {
        required: false
      },
      canWrite: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style>
.tag-space {
  margin-left: -6px !important;
}

.tag-item {
  font-family: "Poppins Regular";
  font-weight: normal;
}

.tag-item-no-color-dark--text {
  color: #FFFFFF !important;
  background-color: #555 !important;
}

.tag-item-no-color-dark--text .mdi-close-circle {
  color: #FFFFFF !important;
}

.tag-item-no-color-light--text {
  color: #7f8182 !important;
  background-color: #f2f2f3 !important;
}

.tag-item-no-color-light--text .mdi-close-circle {
  color: #6f6f70 !important;
}
</style>
