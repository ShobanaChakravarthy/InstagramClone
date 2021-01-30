import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAG4FAbffxeuHYza1M9ipuJLtiI72dgMUw",
    authDomain: "instagram-clone-70c8f.firebaseapp.com",
    projectId: "instagram-clone-70c8f",
    storageBucket: "instagram-clone-70c8f.appspot.com",
    messagingSenderId: "611195330429",
    appId: "1:611195330429:web:b615a4fb67d88a56c6b614",
    measurementId: "G-TNSKZQ0R4L"
});
// the firebaseApp which we initialized above, using that we can use it get firestore which will have all the data
// we are storing it in a variable called db and we are exporting it

const db=firebaseApp.firestore();
const auth=firebaseApp.auth();
const storage=firebaseApp.storage();
export {db,auth,storage};