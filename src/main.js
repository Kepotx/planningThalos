/*
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import Vuex from 'vuex';

import * as EventsStore from '/_components/store/calendar/EventsStore';
import * as CalendarsStore from '/_components/store/calendar/CalendarsStore';
import * as EventFiltersStore from '/_components/store/calendar/EventFiltersStore';
import * as ResourcesStore from '/_components/store/calendar/ResourcesStore';
import * as UserRightsStore from '/_components/store/calendar/UserRightsStore';
import * as ColorsStore from '/_components/store/project-tags/ColorsStore';
import * as TagsStore from '/_components/store/project-tags/TagsStore';

    const store = new Vuex.Store({
    modules: {
      events: EventsStore,
      calendars: CalendarsStore,
      filters: EventFiltersStore,
      resources: ResourcesStore,
      userRights: UserRightsStore,
      colors: ColorsStore,
      tags: TagsStore
    },
  });


Vue.use(Vuex);
new Vue({
    store,
    render: (h) => h(App),
}).$mount('#app')
*/
import Vue from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

import Vuex from 'vuex'
Vue.use(Vuex);

import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7WhBftfarALmow6kQx4O4INEOyiodacw",
  authDomain: "thaloscalendar.firebaseapp.com",
  projectId: "thaloscalendar",
  storageBucket: "thaloscalendar.appspot.com",
  messagingSenderId: "923319933594",
  appId: "1:923319933594:web:f6827d8b6d30c5ca909d23",
  measurementId: "G-JLF1M5FE4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);


import * as EventsStore from '../_components/store/calendar/EventsStore';
import * as CalendarsStore from '../_components/store/calendar/CalendarsStore';
import * as EventFiltersStore from '../_components/store/calendar/EventFiltersStore';
import * as ResourcesStore from '../_components/store/calendar/ResourcesStore';
import * as UserRightsStore from '../_components/store/calendar/UserRightsStore';
import * as ColorsStore from '../_components/store/project-tags/ColorsStore';
import * as TagsStore from '../_components/store/project-tags/TagsStore';


const colorsMap = {colors: {col1 :{"id": "col1","label": "Marron","border": "#000000","bg": "#ac725e","fg": "#000000","fgnobackground": "#ac725e"},col2 :{"id": "col2","label": "Sienne","border": "#000000","bg": "#d06b64","fg": "#000000","fgnobackground": "#d06b64"},col3 :{"id": "col3","label": "Rouge","border": "#000000","bg": "#f83a22","fg": "#000000","fgnobackground": "#f83a22"},col4 :{"id": "col4","label": "Rouge orangé","border": "#000000","bg": "#fa573c","fg": "#000000","fgnobackground": "#fa573c"},col5 :{"id": "col5","label": "Orange foncé","border": "#000000","bg": "#ff7537","fg": "#000000","fgnobackground": "#ff7537"},col6 :{"id": "col6","label": "Orange","border": "#000000","bg": "#ff7537","fg": "#000000","fgnobackground": "#ff7537"},col7 :{"id": "col7","label": "Vert de mer","border": "#000000","bg": "#42d692","fg": "#000000","fgnobackground": "#42d692"},col8 :{"id": "col8","label": "Vert","border": "#000000","bg": "#16a765","fg": "#000000","fgnobackground": "#16a765"},col9 :{"id": "col9","label": "Vert anis","border": "#000000","bg": "#7bd148","fg": "#000000","fgnobackground": "#7bd148"},col10 :{"id": "col10","label": "Vert jaune","border": "#000000","bg": "#b3dc6c","fg": "#000000","fgnobackground": "#b3dc6c"},col11 :{"id": "col11","label": "Jaune","border": "#000000","bg": "#fbe983","fg": "#000000","fgnobackground": "#fbe983"},col12 :{"id": "col12","label": "Or","border": "#000000","bg": "#fad165","fg": "#000000","fgnobackground": "#fad165"},col13 :{"id": "col13","label": "Vert de mer clair","border": "#000000","bg": "#92e1c0","fg": "#000000","fgnobackground": "#92e1c0"},col14 :{"id": "col14","label": "Turquoise pâle","border": "#000000","bg": "#9fe1e7","fg": "#000000","fgnobackground": "#9fe1e7"},col15 :{"id": "col15","label": "Vert de gris","border": "#000000","bg": "#9fc6e7","fg": "#000000","fgnobackground": "#9fc6e7"},col16 :{"id": "col16","label": "Bleu","border": "#000000","bg": "#4986e7","fg": "#000000","fgnobackground": "#4986e7"},col17 :{"id": "col17","label": "Bleu ardoise","border": "#000000","bg": "#9a9cff","fg": "#000000","fgnobackground": "#9a9cff"},col18 :{"id": "col18","label": "Parme","border": "#000000","bg": "#b99aff","fg": "#000000","fgnobackground": "#b99aff"},col19 :{"id": "col19","label": "Gris","border": "#000000","bg": "#c2c2c2","fg": "#000000","fgnobackground": "#c2c2c2"},col20 :{"id": "col20","label": "Grège","border": "#000000","bg": "#cabdbf","fg": "#000000","fgnobackground": "#cabdbf"},col21 :{"id": "col21","label": "Pêche","border": "#000000","bg": "#cca6ac","fg": "#000000","fgnobackground": "#cca6ac"},col22 :{"id": "col22","label": "Rose","border": "#000000","bg": "#f691b2","fg": "#000000","fgnobackground": "#f691b2"},col23 :{"id": "col23","label": "Fushia","border": "#000000","bg": "#cd74e6","fg": "#000000","fgnobackground": "#cd74e6"},col24 :{"id": "col24","label": "Violet","border": "#000000","bg": "#a47ae2","fg": "#000000","fgnobackground": "#a47ae2"}}, resourceColor: {resourcecol0 :{"id": "resourcecol0","label": "Resource","border": "#000000","bg": "#6c757d","fg": "#000000","fgnobackground": "#6c757d"}}};
    const store = new Vuex.Store({
        state: {
            restrictedColorsMap: colorsMap.colors,
            colorsMap: {...colorsMap.resourceColor, ...colorsMap.colors},
            resourceCalendar: { color: '#6c757d'},
            recurrenceTypes:[{"id": "NEVER","label": "Jamais"},{"id": "ALL_DAY","label": "Tous les jours"},{"id": "ALL_WORKING_DAY","label": "Tous les jours ouvrables"},{"id": "WEEKLY","label": "Hebdomadaire"},{"id": "BIWEEKLY","label": "Toutes les deux semaines"},{"id": "MONTHLY","label": "Mensuelle"}],
            glyphs: ["fas fa-ad","fas fa-address-book","fas fa-address-card","fas fa-adjust"]
        },
    modules: {
      events: EventsStore,
      calendars: CalendarsStore,
      filters: EventFiltersStore,
      resources: ResourcesStore,
      userRights: UserRightsStore,
      colors: ColorsStore,
      tags: TagsStore

    },
  });
new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
