// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
    return getToken(messaging, { vapidKey: firebaseConfig.vapidKey })
        .then((currentToken) => {
            if (currentToken) {
                console.log('current token for client: ', currentToken);
            } else {
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