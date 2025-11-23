// 🔥 ÖNEMLİ: Bu bilgileri Firebase Konsolu'ndan alıp buraya yapıştırın!
// Detaylar için FIREBASE_KURULUM.md dosyasını okuyun.

const firebaseConfig = {
    apiKey: "AIzaSyBpjMn2YnFiQ6Ulq04XAWiUmcjCU8hxjeA",
    authDomain: "kudus-kasifleri-71562.firebaseapp.com",
    databaseURL: "https://kudus-kasifleri-71562-default-rtdb.firebaseio.com",
    projectId: "kudus-kasifleri-71562",
    storageBucket: "kudus-kasifleri-71562.firebasestorage.app",
    messagingSenderId: "440933837800",
    appId: "1:440933837800:web:62567806cb86cf77ef125d"
};

// Firebase'i başlat
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    console.log("Firebase başlatıldı!");
} else {
    console.error("Firebase SDK yüklenemedi!");
}
