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
    try {
        firebase.initializeApp(firebaseConfig);
        const database = firebase.database();
        console.log("✅ Firebase başarıyla başlatıldı!");

        // Bağlantı testi
        const connectedRef = firebase.database().ref(".info/connected");
        connectedRef.on("value", (snap) => {
            if (snap.val() === true) {
                console.log("✅ Firebase sunucusuna BAĞLANDI.");
            } else {
                console.log("⚠️ Firebase bağlantısı KOPTU veya kurulamadı.");
            }
        });

    } catch (error) {
        console.error("❌ Firebase başlatma hatası:", error);
        alert("Veritabanı bağlantı hatası! Detaylar konsolda.");
    }
} else {
    console.error("❌ Firebase SDK yüklenemedi! İnternet bağlantınızı kontrol edin.");
}
