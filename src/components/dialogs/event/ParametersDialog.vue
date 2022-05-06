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
  <v-dialog
    v-model="dialog"
    max-width="900"
    content-class="scroller-beauty white"
    :fullscreen="$vuetify.breakpoint.smAndDown"
  >
    <!-- Card -->
    <v-card class="parameters-card">
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
        <v-btn icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>

        <v-toolbar-title
          class="new-project-title text-wrap h3 mb-0"
          v-text="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_TITLE"
        ></v-toolbar-title>
      </v-toolbar>

      <v-toolbar v-else class="sticky-top shadow-none py-4" color="white" flat>
        <v-card-title class="dialog-title" v-text="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_TITLE" />

        <v-btn class="ml-auto" icon @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar>
      <!-- End Toolbar -->

      <!-- Calendars -->
      <v-card-text>
        <div class="d-flex justify-content-between align-center mt-50px" :class="{ 'force-display-block' : $vuetify.breakpoint.xsOnly }">
          <div>
            <h5 class="px-2 mb-0 font-weight-medium">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_CALENDARS}}</h5>
            <p class="px-2"
                v-if="userRights.canCreateCalendar">
              {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_CALENDARS_SUBTEXT }}
            </p>
          </div>
          <v-btn
            v-if="userRights.canCreateCalendar"
            class="ml-5"
            x-large
            depressed
            color="rgba(149,117,205,0.2)"
            v-ripple="{ class: 'primary--text' }"
            @click="handleItemCreateUpdate({})"
          >
            <div class="d-flex align-center primary--text">
              <v-icon class="mr-3" size="18"> fa fa-plus </v-icon>
              {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_CREATE_CALENDAR }}
            </div>
          </v-btn>
        </div>
        <v-list two-line flat>
          <v-list-item-group active-class="primary--text">

            <template v-for="(item, index) in calendars">
              <v-hover v-slot:default="{  }" :key="item.id + '_calendar'">
                <v-list-item @click="handleListItemClick(item)" :class="'calendar_item_'+item.id">
                  <template v-slot:default="{  }">
                    <v-list-item-content>
                      <div class="media">
                        <color-indicator class="mr-2" :color="item.color.bg" />

                        <div class="media-body">
                          <v-list-item-title class="text--secondary">
                            <div class="d-flex align-center">
                              <span class="font-weight-medium">{{ item.title }}</span>
                              <span class="ml-4 grey--text font-weight-regular-italic" v-if="item.public"
                                >
                              {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_CALENDAR_FIELD_VISIBILITY_PUBLIC_LABEL}}
                              </span>
                            </div>
                          </v-list-item-title>
                        </div>
                      </div>
                    </v-list-item-content>

                    <v-list-item-action v-if="userRights.canEditCalendar || userRights.canRemoveCalendar">
                      <v-menu bottom left nudge-right="15.5" nudge-top="9">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon color="primary" v-bind="attrs" v-on="on">
                            <v-icon class="primary--text">mdi-dots-horizontal</v-icon>
                          </v-btn>
                        </template>

                        <v-list>
                          <div class="px-4 d-flex justify-content-end">
                            <v-btn icon color="primary" :ripple="false" class="no-background-hover">
                              <v-icon class="primary--text">mdi-dots-horizontal</v-icon>
                            </v-btn>
                          </div>

                          <v-list-item
                            v-if="userRights.canEditCalendar"
                            class="v-list-default-height font-size-sm font-weight-medium d-flex align-center"
                            @click.stop="handleItemCreateUpdate(item)"
                          >
                            <v-icon class="mr-1"> mdi-pencil </v-icon>
                                {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_EDIT_BUTTON}}
                          </v-list-item>

                          <v-list-item
                            v-if="userRights.canRemoveCalendar"
                            @click.stop="handleItemDelete(item)"
                            class="v-list-default-height font-size-sm font-weight-medium d-flex align-center"
                          >
                            <v-icon class="mr-1"> mdi-delete </v-icon>
                            {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_BUTTON}}
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-hover>

              <v-divider class="my-0 border-light" v-if="index < calendars.length - 1" :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
        <hr />
      </v-card-text>
      <!-- End Calendars -->

      <!-- Resources -->
      <v-card-text>
        <div class="d-flex justify-content-between align-center" :class="{ 'force-display-block' : $vuetify.breakpoint.xsOnly }">
          <div>
            <h5 class="px-2 mb-0 font-weight-medium">
                {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_RESOURCES }}
            </h5>
            <p class="px-2"
                v-if="userRights.canHandleResource">{{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_RESOURCES_SUBTEXT}}</p>
          </div>
           <v-btn
            v-if="userRights.canHandleResource"
            class="ml-5"
            x-large
            depressed
            color="rgba(149,117,205,0.2)"
            v-ripple="{ class: 'primary--text' }"
            @click="handleItemCreateUpdate({}, false)"
          >
            <div class="d-flex align-center primary--text">
              <v-icon class="mr-3" size="18"> fa fa-plus </v-icon>
                  {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_CREATE_RESOURCE }}
            </div>
          </v-btn>
        </div>

        <v-list two-line flat>
          <v-list-item-group active-class="primary--text">
            <template v-for="(item, index) in resources">
              <v-hover v-slot:default="{  }" :key="item.id + '_resource'">
                <v-list-item @click="handleListItemClick(item, false)" :class="'resource_item_'+item.id">
                  <template v-slot:default="{  }">
                    <v-list-item-content>
                      <div class="media">
                        <div class="mr-3" v-if="item.icon">
                          <v-icon size="18">{{ item.icon }}</v-icon>
                        </div>
                        <div class="media-body">
                          <v-list-item-title class="text--secondary text-wrap" >
                            <span class="font-weight-medium ametys-truncate-1 " :data-ametys-tooltip="item.title">{{ item.title }}</span>
                          </v-list-item-title>
                          <div class="resource-desc break-line-anywhere text-justify ametys-truncate-3" :data-ametys-tooltip="item.instructions">
                            {{ item.instructions }}
                          </div>
                        </div>
                      </div>
                    </v-list-item-content>

                    <v-list-item-action v-if="userRights.canHandleResource">

                      <v-menu bottom left nudge-right="15.5" nudge-top="9" >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon color="primary" v-bind="attrs" v-on="on">
                            <v-icon class="primary--text">mdi-dots-horizontal</v-icon>
                          </v-btn>
                        </template>

                        <v-list>
                          <div class="px-4 d-flex justify-content-end">
                            <v-btn icon color="primary" :ripple="false" class="no-background-hover">
                              <v-icon class="primary--text">mdi-dots-horizontal</v-icon>
                            </v-btn>
                          </div>

                          <v-list-item
                            class="v-list-default-height font-size-sm font-weight-medium d-flex align-center"
                            @click.stop="handleItemCreateUpdate(item, false)"
                          >
                            <v-icon class="mr-1"> mdi-pencil </v-icon>
                            {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_EDIT_BUTTON}}
                          </v-list-item>

                          <v-list-item
                            @click.stop="handleItemDelete(item, false)"
                            class="v-list-default-height font-size-sm font-weight-medium d-flex align-center"
                          >
                            <v-icon class="mr-1"> mdi-delete </v-icon>
                            {{i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_BUTTON}}
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-hover>

              <v-divider class="my-0 border-light" v-if="index < calendars.length - 1" :key="index"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card-text>
      <!-- End Resources -->
    </v-card>
    <!-- End Delete Confirm Dialog -->
    <av-dialog
      v-model="deleteConfirm"
      variant="dark"
      @close="deleteConfirm = false"
      :title="selectedItem.isCalendar ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_CALENDAR : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_RESOURCE"
      :okBtnText="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_BUTTON"
      @submit="confirmedDeleteItem"
    >
        <span v-html="deleteMsg()"></span>
    </av-dialog>

    <av-dialog
      v-model="lastCalendar"
      variant="dark"
      @close="lastCalendar = false"
      :submitBtn="false"
      :title="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_CALENDAR"
    >
        <span v-html="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_CANT_DELETE_LAST_CALENDAR_MESSAGE"></span>
    </av-dialog>
    <!-- End Delete Confirm Dialog -->
  </v-dialog>
</template>

<script>
import ColorIndicator from '../../utils/ColorIndicator'
import { mapState, mapGetters } from 'vuex'
import AvDialog from '../../../../_components/feedback/AvDialog.vue'
import eventsMixin from './../../../mixins/eventsMixin'
import i18n from '../../MessageFrench';

export default {
  name: 'ParametersDialog',
  components: { ColorIndicator, AvDialog },
  mixins: [eventsMixin],
  data() {
    return {
        i18n: i18n,
      dialog: false,
      deleteConfirm: false,
      lastCalendar: false,
      selectedItem: {},
    }
  },

  computed: {
    ...mapState({
      resources: (state) => state.resources.resources,
      userRights: (state) => state.userRights.rights,
      foobar: (state) => state.calendars,
    }),

    ...mapGetters({
      calendars: 'calendars/calendars',
    }),
  },

  methods: {
    closeMenu(ref){
      const menu = this.$refs[ref];
      if(menu[0]) menu[0].isActive = false
    },
    close() {
      this.dialog = false
    },
    handleItemDelete({ id, title }, isCalendar = true) {

        if (isCalendar && this.calendars.length == 1)
        {
            this.lastCalendar = true;
        }
        else
        {
            this.selectedItem = { id, title: title, isCalendar };
            this.deleteConfirm = true;
        }
    },
    async confirmedDeleteItem() {
      if (this.selectedItem.isCalendar) {
        await this.$store.dispatch('calendars/deleteCalendar', this.selectedItem.id);
      } else {
        await this.$store.dispatch('resources/deleteResource', this.selectedItem.id)
      }
    },
    handleItemCreateUpdate(item, isCalendar = true) {
      if (isCalendar) {
        window.VEvent.fire('open-calendar-dialog', {
                calendar: item,
                otherCalendars: this.calendars.filter(calendar => calendar.id !== item.id).map(calendar => calendar.title)
            } )
      } else {
          window.VEvent.fire('open-resource-event-dialog', {
              resource: item,
              otherResources: this.resources.filter(resource => resource.id !== item.id).map(resource => resource.title)
          })
      }
    },
    handleListItemClick(item, isCalendar = true) {
      if (isCalendar && !this.userRights.canEditCalendar) return
      if (!isCalendar && !this.userRights.canHandleResource) return
      this.handleItemCreateUpdate(item, isCalendar)
    },
    deleteMsg() {
      let text = i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_CONFIRM_MESSAGE;
      text = text.replace(0, '<span class="primary--text">' + this.selectedItem.title  + '</span>');
      text = text.replace(1, this.selectedItem.isCalendar ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_CONFIRM_MESSAGE_CALENDAR_TEXT : i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_PARAMETERS_DIALOG_DELETE_CONFIRM_MESSAGE_RESOURCE_TEXT);
      return text;
    },

  },

  mounted() {
      window.VEvent.listen('open-parameters-dialog', () => {
      this.dialog = true
    })
  },
}
</script>
<style scoped lang="scss">
.resource-desc{
  color: #9E9E9E !important;
  line-height : 1.4;
  margin-top : 5px;
}
.break-line-anywhere {
  line-break: anywhere;
}

.v-list-item:hover:after {
  opacity: 0.04;
}

.v-list-item:after {
  background-color: currentColor;
  bottom: 0;
  content: '';
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.list-item__actions {
  opacity: 0;
  visibility: hidden;
}
.list-item__actions_show {
  opacity: 1;
  visibility: visible;
}
.font-size-sm {
  font-size: 14px !important;
}

.v-list-default-height{
  height: 48px !important;
  min-height: 48px !important;
  max-height: 48px !important;
}
.parameters-card{
  box-shadow: unset !important;
}
.mt-50px{
    margin-top: 50px !important;
  }
.force-display-block{
    display: block !important;
  }

.parameters-card .v-list-item__content, .parameters-card .media {
    display: block;
}

.parameters-card .mr-3 {
    display: inline-block;
    vertical-align: top;
}

.parameters-card .media-body {
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 36px);
}

.parameters-card .media-body .ametys-truncate-1 {
    line-height: 1.3;
}

.parameters-card .font-weight-medium {
    white-space: nowrap !important;
}

</style>
