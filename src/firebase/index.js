import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyDVKNWSRRqpTCzgQx-rOLml0cRthEPHFbU",
    authDomain: "scorecard-cb260.firebaseapp.com",
    projectId: "scorecard-cb260",
    storageBucket: "scorecard-cb260.appspot.com",
    messagingSenderId: "387122707754",
    appId: "1:387122707754:web:a87f541f69d158718ab253",
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

export {firebaseApp}