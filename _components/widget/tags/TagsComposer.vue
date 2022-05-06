<!--
   Copyright 2021 Anyware Services

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
  <div :class="tagClass">
    <div v-if="!canCreate">
      <v-autocomplete
        v-model="tagsValue"
        :items="allTags"
        item-value="name"
        item-text="text"
        :hide-no-data="!searcher"
        :search-input.sync="searcher"
        :label="label"
        multiple
        :readonly="!canWrite"
        hide-selected
        small-chips
        deletable-chips
        class="input-field__pointer"
      >
        <template v-slot:selection="{  item, parent /*, selected */}">
              <tag-item
                @removeTag="parent.selectItem(item)"
                :canWrite="canWrite"
                :tag="item"
                :colorClass="tagColorClass(item)"
                close />
        </template>

        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="create-new-tag text-wrap g-line-height-1_5">
                {{i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECTDIALOG_MODEL_KEYWORDS_HINT1}} "<strong>{{ searcher }}</strong>" {{i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECTDIALOG_MODEL_KEYWORDS_HINT2}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-autocomplete>
    </div>

    <div v-else>
      <v-combobox
        v-model="tagsValueObject"
        :items="allTags"
        item-value="name"
        item-text="text"
        :hide-no-data="!searcher"
        :search-input.sync="searcher"
        :label="label"
        multiple
        :readonly="!canWrite"
        hide-selected
        small-chips
        deletable-chips
        class="input-field__pointer"
      >
        <template v-slot:selection="{ item, parent /*, selected */}">
          <tag-item
            @removeTag="parent.selectItem(item)"
            :tag="item"
            :canWrite="canWrite"
            :colorClass="tagColorClass(item)"
            close />
        </template>

        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="create-new-tag text-wrap g-line-height-1_5">
                {{i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECTDIALOG_MODEL_KEYWORDS_HINT1}} "<strong>{{ searcher }}</strong>" {{i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECTDIALOG_MODEL_KEYWORDS_HINT2}}
                <br>
                <span v-html="i18n.PLUGINS_WORKSPACES_CATALOGUE_NEWPROJECTDIALOG_MODEL_KEYWORDS_HINT3"></span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </div>
  </div>
</template>

<script>
  import i18n from '../../../src/components/MessageFrench';
  import TagItem from './TagItem';
  import {mapGetters} from 'vuex';
    import AmetysUtils from '../../../src/components/utils/AmetysUtils';

  export default {
    name: "TagsComposer",
    components: {
      TagItem
    },
    props: {
      tags: {
        default: () => []
      },
      allTags: {
        default: () => [],
        required: true
      },
      storeName: {
        type: String,
        required: true
      },
      noColor: {
        type: Boolean,
        default: false
      },
      canWrite: {
        type: Boolean,
        default: true
      },
      canCreate: {
        type: Boolean,
        default: true
      },
      label: {
        type: String
      },
      tagClass: {
        type: String,
        default: 'tag'
      }
    },
    data() {
      return {
        tagsValue: [],
        tagsValueObject: [],
        searcher: null,
        i18n
      }
    },
    mounted() {
        this.tagsValue = this.tags;
        this.tagsValueObject = this.tags2tagsObject(this.tags, this.allTags);
    },
    computed: {
      ...mapGetters({
          colors: 'colors/getColors',
      })
    },
    methods: {
        tagColorClass(tag) {
          if (this.noColor)
          {
            return tag.name != 0 ? "tag-item-no-color-light" : "tag-item-no-color-dark";
          }
          else
          {
            if (tag.color)
            {
                return this.tagClass + "-"  + tag.color;
            }
            else
            {
                let colorsKeys = [];
                for (let colorKey in this.colors)
                {
                  colorsKeys.push(colorKey);
                }

                var s = tag.text;
                var hash = 0;
                for (var i = 0; s && i < s.length; i++)
                {
                  hash += s.charCodeAt(i);
                }
                return this.tagClass + "-" + colorsKeys[hash % colorsKeys.length];
            }
          }
        },
        tags2tagsObject(tags, allTags)
        {
            function _findTag(name)
            {
                if (typeof name === 'string')
                {
                    for (let i in allTags)
                    {
                        if (allTags[i].name == name) return allTags[i]
                    }
                    return null;
                }
                return { name: 0, text: name.text};
            }

            return tags.map(name => _findTag(name)).filter(t => t != null).sort((t1, t2) => AmetysUtils.deemphasize(t1.text.toLowerCase()) == AmetysUtils.deemphasize(t2.text.toLowerCase()) ? 0 : AmetysUtils.deemphasize(t1.text.toLowerCase()) > AmetysUtils.deemphasize(t2.text.toLowerCase()) ? 1 : -1);
        },
        equals(x, y) {
          return x.length === y.length && x.every((value, index) => value === y[index])
        }
    },
    watch: {
      tags(val/*, prev*/) {
        if (this.equals(val, this.tagsValue)) return;

        this.tagsValue = val;
        this.tagsValueObject = this.tags2tagsObject(val, this.allTags);
      },

      tagsValue(val, prev) {
        if (val.length === prev.length) return

        this.$emit("update-tags", val);
      },

      tagsValueObject(val, prev) {
        if (val.length === prev.length) return

        this.tagsValueObject = val.map(v => {
          if (typeof v === 'string') {
            v = {
              name: 0,
              text: v
            }
          }
          return v
        })

        this.tagsValue = this.tagsValueObject.map(v => {
          if (v.name == 0) {
            return {
              text: v.text
            }
          }
          else
            return v.name
        })

      }
    },
  }
</script>

<style lang="scss">
  .create-new-tag {
    font-size: 13px !important;
    color: #6C757D !important;
  }
</style>
