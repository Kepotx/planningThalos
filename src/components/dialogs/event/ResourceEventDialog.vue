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
  <v-dialog v-model="dialog"
            max-width="600"
            persistent
            content-class="scroller-beauty white"
            :fullscreen="$vuetify.breakpoint.smAndDown"
            @click:outside="persistent"
            @keydown.esc="close"
  >
    <!-- Card -->
    <v-card>
      <!-- Toolbar -->
      <v-toolbar
            v-if="$vuetify.breakpoint.smAndDown"
            color="primary"
            prominent
            extension-height="0"
            extended
            elevation="0"
            dark
            rounded="0"
            class="sticky-top"
        >
          <v-btn icon
                 @click="close">
            <v-icon>close</v-icon>
          </v-btn>

          <v-toolbar-title class="new-project-title text-wrap h3 mb-0"
                           v-text="form.id ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_TITLE : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_RESOURCE_TITLE"></v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn x-large
                 depressed
                 dark
                 text
                 v-ripple="{ class: 'primary--text' }"
                 @click="submit"
          >
            <span>
                {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_DIALOG_BOX_OK }}
            </span>
          </v-btn>
      </v-toolbar>

      <v-toolbar v-else class="sticky-top shadow-none py-4" color="white" flat>
        <v-card-title class="dialog-title" v-text="form.id ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_TITLE : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_RESOURCE_TITLE"/>

        <v-btn class="ml-auto" icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <!-- End Toolbar -->

      <!-- Body -->
      <v-form ref="form" lazy-validation>
        <v-card-text class="pb-0">
          <v-container>
            <!-- Title -->
            <v-text-field v-model="form.title"
                          autofocus
                          :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_FIELD_TITLE_LABEL + '*'"
                          :counter="50"
                          :rules="[rules.resourceTitleRule, rules.requiredRule, rules.existingTitleRule]"
                          required
            ></v-text-field>
            <!-- End Title -->

            <!-- Icon -->
            <icon-picker v-model="form.icon"
                         :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_FIELD_ICON_LABEL + '*'"
                         :rules="[rules.requiredRule]"
                         :list="iconList"
            ></icon-picker>
            <!-- End Icon -->

            <!-- Instructions -->
            <v-textarea :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_FIELD_INSTRUCTIONS_LABEL"
                        v-model="form.instructions"
                        :counter="400"
                        rows="1"
                        auto-grow
                        :rules="[rules.resourceInstructionRule]"
            ></v-textarea>
            <!-- End Instructions -->
          </v-container>
        </v-card-text>
        <!-- Footer -->
        <v-card-actions v-if="!$vuetify.breakpoint.smAndDown"  style="position:sticky;bottom:0;" class="white">
          <v-card-text class="d-flex pt-0">
            <v-spacer></v-spacer>

            <v-btn class="mr-2"
                   depressed
                   text
                   x-large
                   color="primary"
                   v-ripple="{ class: 'primary--text' }"
                   @click="close"
            >
              <div class="primary--text">
                  {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_DIALOG_BOX_CANCEL }}
              </div>
            </v-btn>
            <v-btn x-large
                   depressed
                   color="rgba(149,117,205,0.2)"
                   v-ripple="{ class: 'primary--text' }"
                   @click="submit"
            >
              <div class="primary--text">
                  {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_DIALOG_BOX_OK }}
              </div>
            </v-btn>
          </v-card-text>
        </v-card-actions>
        <!-- End Footer -->
      </v-form>
      <!-- End Body -->
    </v-card>
  </v-dialog>
</template>

<script>
import {mapState} from 'vuex'
import IconPicker from './../../../../_components/widget/icon-picker/IconPicker';
import i18n from '../../MessageFrench';

export default {
  name: "ResourceEventDialog",
  components: {
    IconPicker,
  },
  data() {
    return {
        rules: {
            resourceTitleRule: value => (value || "").length <= 50 || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_RESOURCE_TITLE,
            existingTitleRule: value => !this.otherResources.includes(value || "") || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_RESOURCE_TITLE_EXIST,
            resourceInstructionRule: value => (value || "").length <= 400 || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_RESOURCE_INSTRUCTIONS,
            requiredRule: value => (value != undefined && value != "") || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_MANDATORY,
        },
      i18n: i18n,
      dialog: false,
      otherCalendars: [],
      favoriteIcons: ['fas fa-desktop', 'fas fa-car', 'fas fa-chalkboard-teacher', 'fas fa-city', 'fas fa-bus', 'fas fa-hotel'],
      form: {},
      initialForm: {},
    }
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        const params = this.form;
        if (this.form.id) {
          // Edit
          this.$store.dispatch('resources/updateResource', params).then(() => {
            this.close();
          });
        } else {
          // Create
          this.$store.dispatch('resources/addResource', params).then(() => {
            this.close();
          });
        }
      }
    },

    initForm(data = {}) {
      this.form = {
        id: data.id || null,
        title: data.title || '',
        instructions: data.instructions || '',
        icon: data.icon || '',
      };
      this.initialForm = JSON.parse(JSON.stringify(this.form));
    },

    persistent() {
        if (JSON.stringify(this.initialForm) === JSON.stringify(this.form)) {
          this.dialog = false
        }
    },

    close() {
      this.dialog = false
    }
  },

  computed: {
    ...mapState({
        colors: (state) => state.colorsMap,
        glyphs: (state) => state.glyphs,
    }),
    iconList() {
        return [
            {
                'name': i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FAVORITE_ICONS,
                'icons': this.favoriteIcons
            },
            {
                'name': i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OTHER_ICONS,
                'icons': this.glyphs
            }
    ]},
  },
  mounted()
  {
      window.VEvent.listen('open-resource-event-dialog', (params) => {
      this.initForm(params.resource);
      this.dialog = true;
      this.otherResources = params.otherResources;
      if (this.$refs.form) this.$refs.form.resetValidation();
    });
  }
}
</script>
