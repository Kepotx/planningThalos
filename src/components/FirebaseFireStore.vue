
<script>

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// Get a Firestore instance
export const FirebaseStore = firebase
  .initializeApp( {
    apiKey: "AIzaSyD7WhBftfarALmow6kQx4O4INEOyiodacw",
    authDomain: "thaloscalendar.firebaseapp.com",
    projectId: "thaloscalendar",
    storageBucket: "thaloscalendar.appspot.com",
    messagingSenderId: "923319933594",
    appId: "1:923319933594:web:f6827d8b6d30c5ca909d23",
    measurementId: "G-JLF1M5FE4Y"
  })
  .firestore()

  export default {

  }
</script>
