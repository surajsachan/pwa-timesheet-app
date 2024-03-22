// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFunctions, httpsCallable } from "firebase/functions";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDHWw4HrsLAClj2t3M9XKBow8W6wmQySRA",
    authDomain: "timesheet-app-51b98.firebaseapp.com",
    projectId: "timesheet-app-51b98",
    storageBucket: "timesheet-app-51b98.appspot.com",
    messagingSenderId: "434692915444",
    appId: "1:434692915444:web:09a1a0a1583328ac4d1ea1",
    measurementId: "G-46KV9G3MBK",
    vapidKey: "BKSQR0LzS6VOiTQ35Xfh21oxILq-_Lttv7Rq9bTCLfnkIWq7oiFajPPMA6fJF2d5reghRG6I8glh9lnVwBBempo"
};
// const firebaseConfig = {
//     apiKey: "AIzaSyA0rTBTR05aXuV_07Fl1vI_-0NMxGj4wsI",
//     authDomain: "timsheet-app.firebaseapp.com",
//     projectId: "timsheet-app",
//     storageBucket: "timsheet-app.appspot.com",
//     messagingSenderId: "480008130200",
//     appId: "1:480008130200:web:e5290e4bff9d1544d04aed",
//     measurementId: "G-V0BEXVLKT5"
//   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
const addDeviceToFCM = httpsCallable(getFunctions(), 'addDeviceToFCM')

export const requestForToken = async () => {
    return getToken(messaging, { vapidKey: firebaseConfig.vapidKey })
        .then(async (currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
                await addDeviceToFCM({ currentToken })
                console.log('added to fcm')
                // Perform any other neccessary action with the token
            } else {
                // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            }
        })
        .catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("payload", payload)
            resolve(payload);
        });
    });

export default app;