// Service worker richiesto da Firebase Cloud Messaging per ricevere le
// notifiche push quando il sito (o l'app installata su Home/Dock) e' chiuso
// o in background. Deve stare in questa esatta posizione (radice del sito).
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  authDomain: 'mottameteo.firebaseapp.com',
  projectId: 'mottameteo',
  storageBucket: 'mottameteo.firebasestorage.app',
  messagingSenderId: '447368983240',
  appId: '1:447368983240:web:d1b013e944380192296bfd'
});

const messaging = firebase.messaging();

// Firebase mostra gia' automaticamente la notifica in background usando i
// campi "notification"/"webpush.notification" inviati da fcm_send.php; questo
// handler serve solo a garantire un'icona anche se un giorno mancasse.
messaging.onBackgroundMessage(function(payload) {
  var title = (payload.notification && payload.notification.title) || 'Meteo Motta';
  var options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/image/icon.png'
  };
  self.registration.showNotification(title, options);
});
