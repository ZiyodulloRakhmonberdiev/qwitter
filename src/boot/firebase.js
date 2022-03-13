import firebase from "firebase/compat/app"
import "firebase/compat/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCMSyYKPDsHXol2HUvRiypfPBMHaMVEWH4",
  authDomain: "qwitter-9c71d.firebaseapp.com",
  projectId: "qwitter-9c71d",
  storageBucket: "qwitter-9c71d.appspot.com",
  messagingSenderId: "205825683437",
  appId: "1:205825683437:web:9bf7444624999fec1381e4"
}

firebase.initializeApp(firebaseConfig)

let db = firebase.firestore()

export default db