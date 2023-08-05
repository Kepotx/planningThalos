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
    <v-dialog v-model="dialog"
              max-width="730"
              :fullscreen="$vuetify.breakpoint.smAndDown"
              content-class="scroller-beauty white"
              @click:outside="persistent"
              @keydown.esc="close"
              persistent
    >
      <!-- Card -->
      <v-card v-if="dialog">
        <template v-if="!$vuetify.breakpoint.smAndDown">
          <!-- Toolbar -->
          <v-toolbar class="sticky-top shadow-none py-4" color="white" flat>
            <v-card-title class="dialog-title"
                v-text="getTitle()"/>
            <v-btn class="ml-auto" icon @click="close">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <!-- End Toolbar -->
        </template>

        <v-toolbar
            v-else
            color="primary"
            prominent
            extension-height="0"
            extended
            elevation="0"
            rounded="0"
            dark
            class="sticky-top"
        >
          <v-btn icon
                 @click="close">
            <v-icon>close</v-icon>
          </v-btn>

          <v-toolbar-title class="new-project-title text-wrap h3 mb-0"
              v-text="getTitle()"
              ></v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn x-large
                 depressed
                 dark
                 text
                 v-ripple="{ class: 'primary--text' }"
                 @click="confirmDialog"
          >
            <span>
                {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_DIALOG_BOX_OK }}
            </span>
          </v-btn>
        </v-toolbar>
        <!-- Body -->
        <v-form ref="form" lazy-validation>
          <v-card-text class="pb-0">
            <v-container>
              <!-- Title -->
              <v-text-field v-model="form.title"
                            autofocus
                            :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_EVENT_FIELD_TITLE_LABEL + '*'"
                            :counter="100"
                            :rules="[rules.requiredRule, rules.eventTitleRule]"
                            required
              ></v-text-field>
              <!-- End Title -->

              <v-row class="align-items-center mb-5">
                <v-col
                    cols="12"
                    :md="!showEndDate ? 4 : 6">
                  <!-- Start Date -->
                  <dialog-date-picker v-model="form.startDate"
                                      @change="onStartChanged"
                  ></dialog-date-picker>
                  <!-- End Start Date -->
                </v-col>

                <v-col
                    cols="12"
                        :md="!showEndDate ? 4 : 6">
                  <div class="d-flex align-end">
                    <div class="text-muted mr-5">{{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_FROM }}</div>
                    <dialog-time-picker v-model="startTime" @setAllDay="setAllDay" :all-day="form.allDay"
                                        @change="onStartTimeChanged"></dialog-time-picker>
                  </div>
                </v-col>

                <v-col
                    v-show="showEndDate"
                    cols="12"
                    md="6">
                  <!-- End Date -->
                  <div class="d-flex align-end">
                    <div class="text-muted mr-5">{{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_TO }}</div>
                    <dialog-date-picker v-model="form.endDate"
                                        :min-dates="minDates"
                                        @change="onEndChanged"
                    ></dialog-date-picker>
                  </div>
                  <!-- End End Date -->
                </v-col>

                <v-col
                    v-show="!form.allDay"
                    cols="12"
                    :md="!showEndDate ? 4 : 6">
                  <div class="d-flex align-end">
                    <div class="text-muted mr-5" v-if="!showEndDate">{{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_EVENT_TO }}</div>
                    <dialog-end-time-picker :end-date="form.endDate"
                                            :start-date="form.startDate"
                                            :start-time="startTime.value"
                                            v-model="endTime"
                                            @setEndDate="val => form.endDate = val"
                                            @change="onEndTimeChanged"
                                            :rules="[rules.timeRule]"
                    ></dialog-end-time-picker>
                  </div>
                </v-col>
              </v-row>
              <!-- Select of Calendars -->
              <v-select
                        v-model="form.calendar"
                        :label="resourceMode() ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_FIELD_CALENDAR_LABEL : (i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_EVENT_FIELD_CALENDAR_LABEL + '*')"
                        :items="calendars"
                        item-value="id"
                        :rules="resourceMode() ? [] : [rules.requiredRule]"
                        :required="!resourceMode()"
                        :no-data-text="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_NO_DATA_AVAILABLE_CALENDAR"
                        :hint="!form.calendar &&  resourceMode() ? i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_RESOURCE_FIELD_NO_CALENDAR_TEXT : ''"
                        class="mt-5"
                        return-object
                        persistent-hint
              >
                <template v-slot:selection="{item}">
                  <v-chip
                      class="ma-2"
                      close
                      @click:close="form.calendar = null">
                    <color-indicator v-if="item.color.bg" :color="item.color.bg"/>
                    <i class="fa mr-2" v-else-if="item.icon" :class="item.icon"></i>
                    <span class="primary--text mr-2"
                          v-text="item.title"
                    ></span>
                  </v-chip>
                </template>

                <template v-slot:item="{item}">
                  <color-indicator v-if="item.color.bg" :color="item.color.bg"/>
                  <i class="fa mr-2" v-else-if="item.icon" :class="item.icon"></i>
                  <span class="subtitle-2" v-text="item.title"></span>
                </template>
              </v-select>
              <!-- End Select of Calendars -->

              <!-- Reserver -->
              <v-select v-model="form.resourceIds"
                        :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_RESOURCES + (resourceMode() ? '*' : '')"
                        multiple
                        :menu-props="{offsetY: true}"
                        :rules="resourceMode() ? [rules.requiredRule, rules.unavailableResourcesRule] : [rules.unavailableResourcesRule]"
                        :required="resourceMode()"
                        chips
                        item-text="title"
                        item-value="id"
                        :no-data-text="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_NO_DATA_AVAILABLE_RESOURCE"
                        deletable-chips
                        :disabled="!userRights.canBookResource && !userRights.canHandleResource"
                        :items="resources"
              >
                <template  v-slot:item="{item,}">
                  <div class="d-flex align-center w-100">
                    <div class="filter-bar-item-font">{{ item.title }}</div>
                    <check-resource :key="item.available +'__'+ item.id"
                                    :item="item"
                                    class="ml-auto"
                    />
                  </div>
                </template>
              </v-select>
              <!-- End Reserver -->

              <!-- Description -->
              <v-textarea v-model="form.description"
                          :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_DESCRIPTION"
                          :counter="400"
                          rows="1"
                          auto-grow
                          :rules="[rules.eventDescriptionRule]"
                          required
              ></v-textarea>
              <!-- End Description -->
              <template v-if="resourceMode() ? (form.calendar && form.calendar.id != resourceCalendar.id) : true" >
                <!-- Lieux -->
                <v-text-field v-model="form.location"
                              :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_PLACE"
                ></v-text-field>
                <!-- End Lieux -->
                <!-- Étiquettes -->
                <tags-composer
                  :tags="form.tags"
                  :allTags="formatedTags"
                  :canCreate="canCreateTag"
                  @update-tags="updateFormTags"
                  storeName="tags"
                  :label="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FULL_CALENDAR_SELECTED_EVENT_TAGS"
                  tagClass="project-tags"
                />
                <!-- End Étiquettes -->

                <v-row>
                  <v-col cols="12" md="5">
                    <!-- Recarring -->
                    <v-select v-model="form.recurrenceType"
                              :label="i18n.PLUGINS_WORKSPACES_EVENT_LIST_PERIOD_LABEL"
                              item-value="id"
                              item-text="label"
                              :items="recurrenceTypes"
                              @change="onRecurrenceChanged"
                    ></v-select>
                    <!-- End Recarring -->
                  </v-col>

                  <!-- Show IF Only User Hasn't Selected "Jamais" Option-->
                  <v-col
                    v-if="form.recurrenceType && form.recurrenceType != 'NEVER'"
                    class="d-flex"
                    cols="12"
                    md="7">
                    <div class="d-inline-flex align-end align-md-center text-muted mr-5">{{ i18n.PLUGINS_WORKSPACES_EVENT_LIST_PERIOD_UNTIL }}</div>
                    <!-- Recarring Date -->
                    <dialog-date-picker v-model="form.untilDate"
                                        :min-dates="minDates"
                                        @input="onRecurrenceDateChanged"
                                        :rules="[rules.untilDateTimeRule]"
                                        :hideDetails="false"
                                        clearable
                    ></dialog-date-picker>
                    <!-- End Recarring Date -->
                  </v-col>

                </v-row>
              </template>
            </v-container>
          </v-card-text>
        </v-form>
        <!-- End Body -->

        <!-- Footer -->
        <v-card-actions v-if="!$vuetify.breakpoint.smAndDown" style="position:sticky;bottom:0;" class="white">
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
                   @click="confirmDialog"
            >
              <div class="primary--text">
                {{ i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_DIALOG_BOX_OK }}
              </div>
            </v-btn>
          </v-card-text>
        </v-card-actions>
        <!-- End Footer -->
      </v-card>
      <!-- End Card -->
    </v-dialog>
     <occurrence-dialog
         :title="i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_OCCURRENCE_OPERATION_RANGE_EDIT_TITLE"
         :display="occurrenceModal"
         :okBtnTextCallback="okBtnTextCallback"
         :cancelBtnCallback="cancelBtnCallback"
     >
     </occurrence-dialog>

  </div>
</template>

<script>
import {mapState,mapGetters} from 'vuex'
import DialogDatePicker from './components/DialogDatePicker'
import ColorIndicator from '../../utils/ColorIndicator'
import DialogTimePicker from "./components/DialogTimePicker";
import TagsComposer from '../../../../_components/widget/tags/TagsComposer.vue';
import CheckResource from "../../utils/CheckResource";
import DialogEndTimePicker from "./components/DialogEndTimePicker";
import OccurrenceDialog from "./OccurrenceDialog";
import i18n from '../../MessageFrench';
import moment from 'moment-timezone';
import { FirebaseStore } from './../../FirebaseFireStore'

const originalForm = {
  title: '',
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  calendar: null,
  allDay: false,
  recurrenceType: "NEVER",
  untilDate: null,
  tags: [],
  calendars: [],
  location: "",
  organizatorEmail: "",
  description: "",
  members: [],
  resourceIds: [],
  choice: null
}

export default {
  name: "EventDialog",
  components: {DialogEndTimePicker, CheckResource, DialogTimePicker, ColorIndicator, DialogDatePicker, TagsComposer, OccurrenceDialog},

  firestore: {
      calendars: FirebaseStore.collection('calendars')
  },
  data() {
    return {
      i18n: i18n,
      rules: {
          eventDescriptionRule: value => (value || "").length <= 400 || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_EVENT_DESCRIPTION,
          eventTitleRule: value => (value || "").length <= 100 || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_EVENT_TITLE,
          timeRule: () => !moment(this.form.startDate + ' ' + this.startTime.value).isAfter(moment(this.form.endDate + ' ' + this.endTime.value)) || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_END_DATE_BEFORE_START,
          untilDateTimeRule: () => !moment(this.form.endDate + ' ' + this.endTime.value).isAfter(moment(this.form.untilDate + ' ' + this.endTime.value)) || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_UNTIL_DATE_BEFORE_END,
          unavailableResourcesRule: () => !this.resources.some(r => !r.available && this.form.resourceIds.includes(r.id)) || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_RESOURCE_UNAVAILABLE,
          requiredRule: value => (value != undefined && value != "") || i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_FIELD_ERROR_MANDATORY
      },
      startTime: {
        value: moment().format('HH') + ':00'
      },
      endTime: {
        value: moment().add('hours', 1).format('HH') + ':00',
        date: moment().format('YYYY-MM-DD')
      },
      dialog: false,
      dialogMembers: false,
      event: null,
      form: {...originalForm},
      initialForm: {...originalForm},
      headers: [
        {text: 'Participants', align: 'start', value: 'name', sortable:false },
        {text: 'Présence obligatoire', value: 'attendance', sortable:false },
        {text: 'Disponibilité', value: 'availability', sortable:false },
        {text: 'Status', value: 'status', sortable:false },
        {text: '', value: 'actions', sortable:false },
      ],
      members: [],
      invited: {},
      occurrenceModal: false
    }
  },

  methods: {

      okBtnTextCallback(choice) {
          this.event && this.event.id ? this.updateEvent(choice) : this.addEvent(choice)
      },

      cancelBtnCallback() {
          this.occurrenceModal = false
      },
    persistent() {
        if (JSON.stringify(this.initialForm) === JSON.stringify(this.form)) {
          this.dialog = false
        }
    },
    defineTime(dateStr = false) {
      const today = new Date(),
          time = today.getHours() + ":" + today.getMinutes(),
          withTime = dateStr.length > 10

      if (!dateStr) dateStr = moment(dateStr).format('YYYY-MM-DD')

      let start = moment(withTime ? dateStr : `${dateStr} ${time}`)

      if (!withTime) {
        const diff = 60 - start.minute()

        if (diff < 30) {
          start = moment(start).add(diff, "minutes")
        } else if (diff >= 30) {
          start = moment(start).add(diff - 30, "minutes")
        }
      }

      this.startTime.value = start.format('HH:mm')
      this.endTime.value = start.add(1, 'hours').format('HH:mm')
    },

    addMember() {
      if (!Object.keys(this.invited).length) return false

      this.form.members.push({
        user: this.invited,
        "attendance": false,
        "availability": false,
        "status": false
      })

      this.invited = {}
    },
    removeMember(member) {
      this.form.members = this.form.members.filter(m => m.user.id != member.user.id);
    },
    addAllMembers () {
      this.form.members =  this.members.map(m => {
        return {
          user: m,
          "attendance": false,
          "availability": false,
          "status": false
        }
      })

      this.invited = {}
    },
    onOpenDialog(event) {
      if (event) {
        this.onEditPrepeare(event)
      } else {
        if (this.calendars.length) {
          if (!this.resourceMode()) {
            const calendar = this.calendars.find(c => c.id == this.selectedCalendar.id) || this.calendars[0]

            this.form.calendar = calendar
          }

          this.defineTime(moment().format('YYYY-MM-DD'))
        }
      }

      this.initialForm = JSON.parse(JSON.stringify(this.form));
      this.getAvailableResources();
      this.dialog = true
    },
    onOpenDialogFromDate({dateStr, resource}) {
      this.dialog = true
      this.form.startDate = moment(dateStr).format('YYYY-MM-DD')
      this.form.endDate = moment(dateStr).format('YYYY-MM-DD')

      this.defineTime(dateStr)

      if (resource) {
        this.form.resourceIds = [resource.id]
      }

      if (this.calendars.length) {
        if (!this.resourceMode()) {
           const calendar = this.calendars.find(c => c.id == this.selectedCalendar.id) || this.calendars[0]

          this.form.calendar = calendar
        }
      }
      this.initialForm = JSON.parse(JSON.stringify(this.form));
      this.getAvailableResources();
    },
    onEditPrepeare(event) {
      this.event = event
      this.form = Object.assign(this.form, {
        ...this.event,
        untilDate: this.event.untilDate ? moment(this.event.untilDate).format('YYYY-MM-DD') : null,
        startDate: moment(this.event.start).format('YYYY-MM-DD'),
        endDate: moment(this.event.end).format('YYYY-MM-DD'),
      })

      this.startTime.value = moment(this.event.start).format('HH:mm')
      this.endTime.value = moment(this.event.end).format('HH:mm')
    },
    close() {
      this.clear()
      this.$refs.form.resetValidation()
      this.dialog = false
      this.event = null
    },
    clear() {
      this.form = {...originalForm}
      this.initialForm = {...originalForm}

      this.defineTime(moment().format('YYYY-MM-DD'))
    },
    addEvent(choice) {
        const scr = this.scrollToOldPosition()
        if (this.$refs.form.validate()) {
          // Check if user has "Jamais" Option
          if(this.form.recurrenceType == 'NEVER') this.form.untilDate = null

          const startTime = this.form.allDay ? '00:00' : this.startTime.value
          const endTime = this.form.allDay ? '00:00' : this.endTime.value

          this.$store.dispatch('events/addEvent', {
            ...this.form,
            choice: choice,
            fullDay: this.form.allDay,
            zoneId: moment.tz.guess(),
            color: this.form.calendar ? this.form.calendar.color.bg : '#909090',
            startDate: moment(this.form.startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm').toISOString(true),
            endDate: moment(this.form.endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm').toISOString(true),
            parentId: this.form.calendar ? this.form.calendar.id : this.resourceCalendar.id,
            untilDate: moment(this.form.untilDate).toISOString(true),
          })
              .then(() => {
                scr.scroll()
              })
          this.close()
        }
    },
    updateEvent(choice) {
        const scr = this.scrollToOldPosition()
        if (this.$refs.form.validate()) {

            // Only call server if needed
            if (JSON.stringify(this.initialForm) !== JSON.stringify(this.form)
                    || this.startTime.value !== moment(this.event.start).format('HH:mm')
                    || this.endTime.value !== moment(this.event.end).format('HH:mm'))
            {
                // Check if user has "Jamais" Option
                if(this.form.recurrenceType == 'NEVER') this.form.untilDate = null

                const startTime = this.form.allDay ? '00:00' : this.startTime.value
                const endTime = this.form.allDay ? '00:00' : this.endTime.value

                this.$store.dispatch('events/updateEvent', {
                  ...this.event,
                  ...this.form,
                  choice: choice,
                  fullDay: this.form.allDay,
                  zoneId: moment.tz.guess(),
                  color: this.form.calendar ? this.form.calendar.mainColor : '#909090',
                  startDate: moment(this.form.startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm').toISOString(true),
                  endDate: moment(this.form.endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm').toISOString(true),
                  parentId: this.form.calendar ? this.form.calendar.id : this.resourceCalendar.id,
                  untilDate: moment(this.form.untilDate).toISOString(true),
                })
                    .then(() => {
                      scr.scroll()
                    })
            }

            this.close()
        }

    },
    onStartTimeChanged(val) {


      if (val.value != this.startTime.value)
      {
          let that = this;
          if (this.form.allDay)
          {
              this.endTime.value = moment(moment().format('YYYY-MM-DD') + 'T' + val.value).add('hours', 1).format('HH:mm')
          }
          else
          {
              var oldStart = moment(this.form.startDate + ' ' + this.startTime.value, 'YYYY-MM-DD HH:mm');
              var newStart = moment(this.form.startDate + ' ' + val.value, 'YYYY-MM-DD HH:mm');

              var difference = newStart.diff(oldStart);

              var oldEnd = moment(this.form.endDate + ' ' + this.endTime.value, 'YYYY-MM-DD HH:mm');
              var newEnd = oldEnd.add(difference, 'ms');

              this.endTime.value = newEnd.format('HH:mm');

              // delay the end date modification so the DialogEndTimePicker watcher is up to date on the time.
              window.setTimeout(function() {
                  that.form.endDate = newEnd.format('YYYY-MM-DD');
                  // force validation for timeRule rule
                  that.$refs.form.validate();
              }, 1);
          }
          this.form.allDay = false;

          window.setTimeout(function() {
              that.getAvailableResources();
          }, 1);

      }
    },
    onStartChanged(val) {

        var oldStart = moment(this.form.startDate + ' ' + this.startTime.value, 'YYYY-MM-DD HH:mm');
        var newStart = moment(val + ' ' + this.startTime.value, 'YYYY-MM-DD HH:mm');

        var difference = newStart.diff(oldStart);

        var oldEnd = moment(this.form.endDate + ' ' + this.endTime.value, 'YYYY-MM-DD HH:mm');
        var newEnd = oldEnd.add(difference, 'ms');

        this.endTime.value = newEnd.format('HH:mm');
        this.form.endDate = newEnd.format('YYYY-MM-DD');

        let that = this;
        window.setTimeout(function() {
            that.getAvailableResources();
        }, 1);
    },
    onEndChanged(val, oldVal) {

        if (this.form.untilDate)
        {
            var oldEnd = moment(oldVal + ' ' + this.endTime.value, 'YYYY-MM-DD HH:mm');
            var newEnd = moment(val + ' ' + this.endTime.value, 'YYYY-MM-DD HH:mm');

            var difference = newEnd.diff(oldEnd);

            var oldUntilDate = moment(this.form.untilDate, 'YYYY-MM-DD');
            var newUntilDate = oldUntilDate.add(difference, 'ms');

            this.form.untilDate = newUntilDate.format('YYYY-MM-DD');
        }

        let that = this;
        window.setTimeout(function() {
            that.getAvailableResources();
        }, 1);
    },
    onEndTimeChanged(/*val*/) {
        let that = this;
        window.setTimeout(function() {
            that.getAvailableResources();
        }, 1);
    },
    onRecurrenceChanged(/*val*/) {
        let that = this;
        window.setTimeout(function() {
            that.getAvailableResources();
        }, 1);
    },
    onRecurrenceDateChanged(/*val*/) {
        let that = this;
        window.setTimeout(function() {
            that.getAvailableResources();
        }, 1);
     },
    setAllDay(allDay) {

      if (this.form.allDay != allDay)
      {
          this.form.allDay = allDay
          if (!allDay && this.startTime.value == this.endTime.value && this.form.startDate == this.form.endDate && this.startTime.value == "00:00")
          {
              this.endTime.value = "01:00";
          }
          let that = this;
          window.setTimeout(function() {
              that.getAvailableResources();
          }, 1);
      }
    },
    updateFormTags(tags){
      this.form.tags = tags;
    },
    resourceMode() {
        if (!Object.prototype.hasOwnProperty.call(window, 'FullCalendarAPI')) return false
        return window.FullCalendarAPI.view.type.indexOf('resource') !== -1
      },

      getTitle() {
        if (!this.event || !this.event.id)
        {
            return i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_ADD_EVENT_TITLE;
        }
        else if (this.event.isResource)
        {
            return i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_BOOK_RESSOURCE_TITLE
        }
        else
        {
            return i18n.PLUGINS_WORKSPACES_PROJECT_SERVICE_MODULE_CALENDAR_EDIT_EVENT_TITLE;
        }
      },
    scrollToOldPosition() {
      let $scroller = document.querySelectorAll('.fc-scroller.fc-scroller-liquid-absolute')

      if (!$scroller.length) return

      $scroller = $scroller[$scroller.length - 1]

      const scrollLeft = $scroller.scrollLeft

      return {
        scroll() {
          setTimeout(() => {
            $scroller.scrollLeft = scrollLeft
          })
        }
      }
    },
    confirmDialog() {

        if (!this.event || !this.event.id)
        {
            this.addEvent();
        }
        else if(this.form.recurrenceType && this.event.recurrenceType != 'NEVER')
        {
            // If the form is invalid, don't open the modal
            this.occurrenceModal = this.$refs.form.validate();
        }
        else
        {
            this.updateEvent();
        }

      },

      getAvailableResources() {
          const startTime = this.form.allDay ? '00:00' : this.startTime.value
          const endTime = this.form.allDay ? '24:00' : this.endTime.value

          var startDate = moment(this.form.startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm').toISOString(true);

          // If we are checking for a recurring event, check all events since the first one, as we should also check events between first occurence and current one
          if (this.event && moment(this.event.originalStart) < moment(startDate) && this.form.recurrenceType != 'NEVER')
          {
              startDate = moment(this.event.originalStart).toISOString(true);
          }
          var endDate = moment(this.form.endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm').toISOString(true);
          if (this.form.recurrenceType != 'NEVER')
          {
              // TODO a valider
              endDate = this.form.untilDate ? moment(this.form.untilDate).toISOString(true) : moment(this.form.endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm').add(1, 'y').toISOString(true);
          }

          var eventStartDateAsStr = moment(this.form.startDate + ' ' + startTime, 'YYYY-MM-DD HH:mm').toISOString(true);
        const params = {
          id:this.form.id,
          allDay:this.form.allDay,
          startDate: startDate,
          endDate: endDate,
          zone: moment.tz.guess(true),
          eventStartDateAsStr: eventStartDateAsStr,
          eventEndDateAsStr: moment(this.form.endDate + ' ' + endTime, 'YYYY-MM-DD HH:mm').toISOString(true),
          recurrenceType: this.form.recurrenceType,
          originalOccurrenceStartAsStr: this.event ? moment(this.event.originalOccurrenceStart).toISOString(true) : eventStartDateAsStr,
        }

        const isStartInsideRange = new Date(params.startDate).getTime() >= new Date(this.startDate).getTime()
        const isEndInsideRange = new Date(params.endDate).getTime() <= new Date(this.endDate).getTime()

        var that = this;

        /*  Is In The Current Date Range */
        if(isStartInsideRange && isEndInsideRange && this.form.recurrenceType == 'NEVER'){
          this.$store.dispatch('resources/loadResourcesWithAvailabilityInCurrentRange', params)
          .then(() => {
              if (that.$refs.form)
              {
                  that.$refs.form.validate();
              }
            });
        }else{
          this.$store.dispatch('resources/loadResourcesWithAvailability', params)
          .then(() => {
              if (that.$refs.form)
              {
                  that.$refs.form.validate();
              }
            });
        }

      }




  },

  computed: {
    minDates() {
      return moment(this.form.startDate).format('YYYY-MM-DD')
    },
    ...mapState({
        recurrenceTypes: state => state.recurrenceTypes,
      resources: state => state.resources.resourcesAvailability,
      userRights: state => state.userRights.rights,
      startDate: state => state.filters.start,
      endDate: state => state.filters.end,
      selectedCalendar: state => state.filters.chip
    }),
     ...mapGetters({
         allTags: 'tags/getTags',
         canCreateTag: 'tags/canCreate',
         resourceCalendar: 'calendars/resourceCalendar',
    }),
    formatedTags(){
      return this.allTags;
    },
    filterMembers() {
      return this.members.filter(m => {
        let next = true
        var members = this.form.members || [];
        members.forEach(mem => {
          if (mem.user.id === m.id) {
            next = false
          }
        })

        return next
      })
    },
    showEndDate() {
      let isAfter = moment(moment(this.form.endDate).format('YYYY-MM-DD')).isAfter(moment(moment(this.form.startDate).format('YYYY-MM-DD')))
      return (isAfter || this.form.allDay)
    }
  },

  watch: {

    dialog(val) {
      if (!val) {
        this.close()
      }
    },

    form: {
      deep: true,
      handler: function (val) {
        if (moment(val.startDate).isAfter(moment(val.endDate))) {
          this.form.endDate = moment(val.startDate).format('YYYY-MM-DD')
        }
      }
    }
  },

  mounted() {
    window.VEvent.listen('open-event-dialog', this.onOpenDialog)
    window.VEvent.listen('event-dialog-from-date', this.onOpenDialogFromDate)
  }
}
</script>

<style lang="scss">
.scroller-beauty {
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #eee;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:vertical {
    height: 10px !important;
  }
}

.event-dialog {
  overflow: hidden;
  background: #c7ecee;
}

.new-project-title {
  font-size: 22px !important;
  line-height: 1.2;
}

.sticky-top {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1020;
}
.fc-scrollgrid-section.fc-scrollgrid-section-body.fc-scrollgrid-section-liquid td:first-child .fc-scroller.fc-scroller-liquid-absolute{
    padding-bottom: 15px;
    bottom: -15px;
}
</style>
