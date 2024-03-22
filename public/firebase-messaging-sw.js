// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyDHWw4HrsLAClj2t3M9XKBow8W6wmQySRA",
    authDomain: "timesheet-app-51b98.firebaseapp.com",
    projectId: "timesheet-app-51b98",
    storageBucket: "timesheet-app-51b98.appspot.com",
    messagingSenderId: "434692915444",
    appId: "1:434692915444:web:09a1a0a1583328ac4d1ea1",
    measurementId: "G-46KV9G3MBK",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});