<template>
  <!--v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <HelloWorld/>
        <calendar-container :colorsMap="colorsMap"></calendar-container>
    </v-main>
  </v-app-->

    <v-app>

    <h1>  Développement en cours, l'application n'est pas encore utilisable pour le moment, mais patience, c'est pour très bientôt </h1>
            <calendar-header style="display : none">
        <!-- Toolbar -->
        <calendar-toolbar></calendar-toolbar>
        <!-- End Toolbar -->
      </calendar-header>
      <v-container
          fluid
          class="px-md-5 mt-md-10"
          :class="{'pt-10': $vuetify.breakpoint.smAndUp}">
        <!-- Skelton Loader -->
        <!--   <calendar-module-skelton v-if="loading"></calendar-module-skelton> -->
        <calendar-module-skelton v-if="false"></calendar-module-skelton>
        <!-- End Skelton Loader  -->

        <v-row v-else>
          <!-- Events Container -->
          <event-container style="display : none"></event-container>
          <!-- End Events Container -->

          <!-- Calendar -->
          <calendar-container :colorsMap="colorsMap"></calendar-container>
          <!-- End Calendar -->
        </v-row>
      </v-container>

      <!-- Dialogs -->
      <event-dialog />
      <resource-event-dialog />
      <calendar-dialog />
      <parameters-dialog  style="display : none"/>
      <!-- End Dialogs -->

      <!-- Fab Button -->
      <fab-button-menu v-if="this.$vuetify.breakpoint.smAndDown"/>
      <!-- End Fab Button -->

        <HelloWorld/>
    </v-app>
</template>
<script>
import HelloWorld from './components/HelloWorld';
import CalendarContainer from './components/calendar/CalendarContainer';

  import EventContainer from './components/calendar/events/EventContainer';
  import CalendarToolbar from './components/toolbar/CalendarToolbar';
  import EventDialog from './components/dialogs/event/EventDialog';
  import ResourceEventDialog from "./components/dialogs/event/ResourceEventDialog";
  import ParametersDialog from "./components/dialogs/event/ParametersDialog";
  import CalendarDialog from "./components/dialogs/event/CalendarDialog";
  import CalendarHeader from "./components/calendar/CalendarHeader";
  import FabButtonMenu from "./components/toolbar/FabButtonMenu";
  import CalendarModuleSkelton from './components/utils/CalendarModuleSkelton';

export default {
  name: 'App',

  components: {
    HelloWorld,
    CalendarContainer,
      FabButtonMenu,
      CalendarHeader,
      CalendarDialog,
      ResourceEventDialog,
      ParametersDialog,
      EventDialog,
      CalendarToolbar,
      EventContainer,
      CalendarModuleSkelton
  },

  data() {
    window.VEvent = {
        _listeners: {},

        fire: function(event, data)
        {
            var listeners = window.VEvent._listeners[event] || [];
            for (var i=0; i < listeners.length; i++)
            {
                listeners[i](data);
            }
        },

        listen: function(event, listener)
        {
            window.VEvent._listeners[event] = window.VEvent._listeners[event] || [];
            window.VEvent._listeners[event].push(listener);
        }
    };
    return {
      "colorsMap": function() { return {"colors": {"col1" :{"id": "col1","label": "Marron","border": "#000000","bg": "#ac725e","fg": "#000000","fgnobackground": "#ac725e"}}, "resourceColor": {"resourcecol0" :{"id": "resourcecol0","label": "Resource","border": "#000000","bg": "#6c757d","fg": "#000000","fgnobackground": "#6c757d"}}} },
    "recurrenceTypes": function() { return [{"id": "NEVER","label": "Jamais"},{"id": "ALL_DAY","label": "Tous les jours"},{"id": "ALL_WORKING_DAY","label": "Tous les jours ouvrables"},{"id": "WEEKLY","label": "Hebdomadaire"}] },
    "resourceCalendar": function() { return { color: '#6c757d'}},
    "glyphs": function() { return ["fas fa-ad","fas fa-address-book","fas fa-address-card","fas fa-adjust","fas fa-air-freshener","fas fa-align-center","fas fa-align-justify","fas fa-align-left","fas fa-align-right","fas fa-allergies","fas fa-ambulance","fas fa-american-sign-language-interpreting","fas fa-anchor","fas fa-angle-double-down","fas fa-angle-double-left","fas fa-angle-double-right","fas fa-angle-double-up","fas fa-angle-down","fas fa-angle-left","fas fa-angle-right","fas fa-angle-up"] },

    }
  },
};
</script>
