/*
 *  Copyright 2021 Anyware Services
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
  <div class="tags-list">
    <span v-for="(tag, key) in shownTags"
        :key="key"
        :class="tagColorClass(tag) + '--text tag text-truncate'"
        style="max-width: 220px;"
    >
      <v-icon :class="tagColorClass(tag) + '--text mr-1'" size="12">fas fa-hashtag</v-icon>{{ tag.text }}
      <template v-if="key + 1 === shownTags.length">
        {{hideTags()}}
      </template>
      </span>

    <!-- Hidden Tags -->
    <span v-if="countHiddenTags > 0"
          id="tag-count"
          class="tag"
          v-on="on"
          :data-ametys-tooltip="tagsTooltip()"
          >
      {{countHiddenTags}}
      <v-icon class="mr-1" size="12">fas fa-hashtag</v-icon>
    </span>
    <!-- End Hidden Tags -->
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'

export default {
  name: "TagsShort",
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      complite: false,
      nodes: [],
      width: this.lines > 1 ? this.lineWidth : this.lineWidth - 50
    }
  },
  computed: {
      ...mapState({
        allTags: state => state.tags.tags,
      }),
    ...mapGetters({
          colors: 'colors/getColors'
    }),
    // Return count of the hidden tags
    countHiddenTags() {
      return this.objectTags.length > this.shownTags.length ? this.objectTags.length - this.shownTags.length : false
    },
    objectTags() {
        return this.tags2tagsObject(this.tags, this.allTags);
      },

      shownTags() {
          return this.tags2tagsObject(this.tags, this.allTags);
        },

  },
  methods: {
    tagsTooltip()
    {
      let html = "";
      for (let index in this.objectTags)
      {
        if (index > (this.objectTags.length - this.countHiddenTags) -1)
        {
          let tag = this.objectTags[index];
          html += "<span class='tag-tooltip'>"
          html += tag.text;
          if (index != this.objectTags.length - 1)
          {
            html += ", ";
          }
          html +="</span>"
        }
      }

      return html;
    },
    // Calculate tags width
    hideTags()
    {
      for (var i = this.shownTags.length - 1; i >= 0; i--) {
        setTimeout(() => {
          if (this.$el.clientHeight > 63) {
            this.shownTags.splice(i, 1)
          }
        }, 90)
      }
    },
    tagColorClass(tag)
    {
      if (tag.color)
      {
          return "project-tags-"  + tag.color;
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
          return "project-tags-" + colorsKeys[hash % colorsKeys.length];
      }
    },
    tags2tagsObject(tags, allTags)
    {

      function deemphasize(s)
       {
           if (!s) return s;

           s = s.replace(new RegExp(/[ÀÁÂÃÄÅ]/g),"A");
           s = s.replace(new RegExp(/[àáâãäå]/g),"a");
           s = s.replace(new RegExp(/Æ/g),"AE");
           s = s.replace(new RegExp(/æ/g),"ae");
           s = s.replace(new RegExp(/Ç/g),"C");
           s = s.replace(new RegExp(/ç/g),"c");
           s = s.replace(new RegExp(/[ÈÉÊË]/g),"E");
           s = s.replace(new RegExp(/[èéêë]/g),"e");
           s = s.replace(new RegExp(/[ÌÍÎÏ]/g),"I");
           s = s.replace(new RegExp(/[ìíîï]/g),"i");
           s = s.replace(new RegExp(/Ñ/g),"N");
           s = s.replace(new RegExp(/ñ/g),"n");
           s = s.replace(new RegExp(/[ÒÓÔÕÖ]/g),"O");
           s = s.replace(new RegExp(/[òóôõö]/g),"o");
           s = s.replace(new RegExp(/Œ/g),"OE");
           s = s.replace(new RegExp(/œ/g),"oe");
           s = s.replace(new RegExp(/[ÙÚÛÜ]/g),"U");
           s = s.replace(new RegExp(/[ùúûü]/g),"u");
           s = s.replace(new RegExp(/[ÝŸ]/g),"y");
           s = s.replace(new RegExp(/[ýÿ]/g),"y");

           return s;
       }

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

        return tags.map(name => _findTag(name)).filter(t => t != null).sort((t1, t2) => deemphasize(t1.text.toLowerCase()) == deemphasize(t2.text.toLowerCase()) ? 0 : deemphasize(t1.text.toLowerCase()) > deemphasize(t2.text.toLowerCase()) ? 1 : -1);
    }
  },
  mounted() {

    setTimeout(() => {
      if (this.$el.clientHeight) {
        this.hideTags()
      }
    }, 300)
  }
}
</script>

<style lang="scss">
.tags-list {
  display: flex;
  flex-wrap: wrap;
}

.tag {
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 4px 12px;
  font-family: Poppins Regular;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  border-radius: 12.5px;
  background-color: rgba(240, 143, 119, 0.2);
}

#tag-count {
  background-color: rgb(204, 204, 204);
  border-color: rgb(204, 204, 204);
  color: rgba(0, 0, 0, .87);
}

#tag-count .v-icon {
  color: rgba(0, 0, 0, .87) !important;
}
</style>
