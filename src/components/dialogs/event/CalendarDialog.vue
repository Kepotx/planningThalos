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
            content-class="scroller-beauty white"
            persistent
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
              v-text="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_CALENDAR_TITLE"></v-toolbar-title>

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


      <v-toolbar v-else class="shadow-none py-4" color="white" flat>
        <v-card-title class="dialog-title" v-text="form.id ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_TITLE : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_CALENDAR_TITLE" />

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
                          :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_FIELD_TITLE_LABEL + '*'"
                          :rules="[rules.requiredRule, rules.calendarTitleRule, rules.existingTitleRule]"
                          :counter="50"
                          required
            ></v-text-field>
            <!-- End Title -->
            <!-- Select of Calendars -->
            <v-input v-model="form.color" class="custom-input-color-picker" :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_FIELD_COLOR_LABEL + '*'"  :rules="[rules.requiredRule]" required>

                <color-picker v-model="form.color.id"
                              :colors="colors"
                />
            </v-input>
            <!-- End Select of Calendars -->

            <!-- Public Checkbox -->
            <v-checkbox v-model="form.public" :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_FIELD_VISIBILITY_PUBLIC_LABEL" class="v-checkbox-label-mb-0" :messages="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_FIELD_VISIBILITY_DESCRIPTION"></v-checkbox>
            <!-- End Public Checkbox -->
          </v-container>
        </v-card-text>

        <!-- Footer -->
        <v-card-actions v-if="!$vuetify.breakpoint.smAndDown" >
          <v-card-text class="d-flex pt-0">
            <v-spacer></v-spacer>

            <v-btn class="mr-2" depressed text x-large color="primary" v-ripple="{ class: 'primary--text' }" @click="close">
              <div class="primary--text">{{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_DIALOG_BOX_CANCEL }}</div>
            </v-btn>

            <v-btn x-large depressed color="rgba(149,117,205,0.2)" v-ripple="{ class: 'primary--text' }" @click="submit">
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
import { mapState } from 'vuex';
import eventsMixin from './../../../mixins/eventsMixin';
import ColorPicker from './components/VColorPicker';
import i18n from '../../MessageFrench';
export default {
  name: 'CalendarDialog',
  mixins: [eventsMixin],
  components: {
    ColorPicker
  },
  data() {
    return {
      dialog: false,
      form: {color: { id: 'col1'}},
      otherCalendars: [],
      initialForm: {color: { id: 'col1'}},
      i18n,
    };
  },

  computed: {
    ...mapState({
        colors: (state) => state.restrictedColorsMap,
        glyphs: (state) => state.glyphs,
    }),
    rules() {
        return {
            calendarTitleRule: value => (value || "").length <= 50 || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_CALENDAR_TITLE,
            existingTitleRule: value => !this.otherCalendars.includes(value || "") || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_CALENDAR_TITLE_EXIST,
            requiredRule: value => (value != undefined && value != "") || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_MANDATORY,
        }
      },
  },

  methods: {
    close() {
      this.initForm();
      this.dialog = false;
    },

    initForm(data = {}) {
      this.form = {
        id: data.id || null,
        title: data.title || '',
        templateDesc: data.templateDesc || '',
        color: data.color || { id: 'col1'},
        public: data.public || false,
      };

      this.initialForm = JSON.parse(JSON.stringify(this.form));
    },

    persistent() {
      if (JSON.stringify(this.initialForm) === JSON.stringify(this.form)) {
        this.dialog = false;
      }
    },

    async submit() {
      if (this.$refs.form.validate()) {
        const params = this.form;
        if (JSON.stringify(this.initialForm) !== JSON.stringify(this.form))
        {
            if (this.form.id) {
                // Edit
                await this.$store.dispatch('calendars/updateCalendar', params)
            } else {
                // Create
                await this.$store.dispatch('calendars/addCalendar', params);
            }
        }

        this.dialog = false;
      }
    },
  },

  mounted() {
    window.VEvent.listen('open-calendar-dialog', (params = {}) => {
      this.initForm(params.calendar);
      this.dialog = true;
      this.otherCalendars = params.otherCalendars;
      if (this.$refs.form) this.$refs.form.resetValidation();
    });
    this.$store.dispatch('colors/loadColors');
  },
};
</script>

<style lang="scss">
.v-checkbox-label-mb-0 {
  .v-input__slot {
    .v-label {
      margin-bottom: 0;
    }
  }
}
.custom-input-color-picker {
  .v-input__control {
    .v-input__slot {
      flex-flow: column;
      align-items: flex-start;
      padding-top: 12px;
      margin-top: 4px;
    }
  }
}
.custom-color-picker {
  max-width: 100% !important;
  .v-color-picker__controls {
    display: none !important;
  }
  .v-color-picker__swatches {
    & > div {
      padding: 0;
      justify-content: start;
    }
  }
}
</style>
