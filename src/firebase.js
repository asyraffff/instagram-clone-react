import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAdO44Jq68npc-OorZYvp_m-umiYd23BnI",
    authDomain: "instagram-clone-react-97c56.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-97c56.firebaseio.com",
    projectId: "instagram-clone-react-97c56",
    storageBucket: "instagram-clone-react-97c56.appspot.com",
    messagingSenderId: "408064452718",
    appId: "1:408064452718:web:aeb59f28aa2ed356491e7f",
    measurementId: "G-SHPP51WM67"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };