importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

// Initialize Firebase (You MUST include Firebase credentials here)
firebase.initializeApp({
  apiKey: "AIzaSyAoNBI8GtVrAKh2o5FZs5rITRVLIJJ6j8E",
  authDomain: "reeda-3a1a7.firebaseapp.com",
  projectId: "reeda-3a1a7",
  storageBucket: "reeda-3a1a7.firebasestorage.app",
  messagingSenderId: "299518705063",
  appId: "1:299518705063:web:da79ba0d587f7a19ef4a82"
});

// Initialize Messaging
const messaging = firebase.messaging();

// self.addEventListener('push', function(event) {
//   const payload = event.data ? event.data.json() : {};
//   event.waitUntil(
//       self.registration.showNotification(payload.notification.title, {
//           body: payload.notification.body,
//           icon: '/icon-512x512.png'
//       })
//   );
// });

// Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message ", payload);
//   self.registration.showNotification('payload.data.title', {
//     body: 'payload.data.body',
//     icon: "/icon.png",
//   });
// });
