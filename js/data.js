
const DataManager = {
    init() {
        // Initialize LocalStorage if empty
        if (!localStorage.getItem('kk_users')) {
            this.initDefaultUsers();
        }
        if (!localStorage.getItem('kk_questions')) {
            this.initDefaultQuestions();
        }
        if (!localStorage.getItem('kk_badges')) {
            this.initBadges();
        }
        if (!localStorage.getItem('kk_ranks')) {
            this.initRanks();
        }
        if (!localStorage.getItem('kk_messages')) {
            this.initMessages();
        }
        if (!localStorage.getItem('kk_bots_initialized')) {
            this.initBotUsers();
        }

        // Sync with Firebase if available
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            this.syncWithFirebase();
        }
    },

    syncWithFirebase() {
        const db = firebase.database();

        // 1. Listen for changes from Firebase and update LocalStorage
        db.ref('questions').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                localStorage.setItem('kk_questions', JSON.stringify(data));
                console.log('Questions synced from Firebase');
            }
        });

        db.ref('users').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Merge logic could be better, but for now overwrite
                // Be careful not to overwrite current session user data if needed
                localStorage.setItem('kk_users', JSON.stringify(data));
                console.log('Users synced from Firebase');
            }
        });

        db.ref('messages').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                localStorage.setItem('kk_messages', JSON.stringify(data));
                console.log('Messages synced from Firebase');
            }
        });

        db.ref('settings').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                localStorage.setItem('kk_game_settings', JSON.stringify(data));
                console.log('Settings synced from Firebase');
            }
        });

        // 2. Initial Push (if Firebase is empty, push local data)
        // This is dangerous if multiple users push default data. 
        // Ideally, only Admin pushes. For now, we assume Admin sets up the DB.
    },

    // Helper to push data to Firebase
    pushToFirebase(key, data) {
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            firebase.database().ref(key).set(data)
                .then(() => console.log(`${key} pushed to Firebase`))
                .catch(e => console.error('Firebase push error:', e));
        }
    },

    initDefaultUsers() {
        let users = [];
        let adminUser = {
            id: 'admin',
            username: 'fatihguzel',
            password: 'Fatih5634',
            role: 'admin',
            level: 10,
            xp: 0,
            badges: []
        };
        users.push(adminUser);
        localStorage.setItem('kk_users', JSON.stringify(users));
    },

    initDefaultQuestions() {
        const defaultQuestions = [
            {
                id: 1,
                text: "Mescid-i Aksa hangi şehirdedir?",
                options: ["Mekke", "Medine", "Kudüs", "İstanbul"],
                correct: 2,
                level: 1
            },
            {
                id: 2,
                text: "İlk kıblemiz neresidir?",
                options: ["Kabe", "Mescid-i Aksa", "Mescid-i Nebevi", "Ayasofya"],
                correct: 1,
                level: 1
            }
        ];
        localStorage.setItem('kk_questions', JSON.stringify(defaultQuestions));
    },

    getUsers() {
        return JSON.parse(localStorage.getItem('kk_users') || '[]');
    },

    saveUser(user) {
        const users = this.getUsers();
        const existingIndex = users.findIndex(u => u.id === user.id);
        if (existingIndex >= 0) {
            users[existingIndex] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem('kk_users', JSON.stringify(users));
        this.pushToFirebase('users', users); // Sync
    },

    findUser(username, password) {
        const users = this.getUsers();
        return users.find(u => u.username === username && u.password === password);
    },

    getUser(username) {
        const users = this.getUsers();
        return users.find(u => u.username === username);
    },

    registerUser(username, password) {
        const users = this.getUsers();
        if (users.find(u => u.username === username)) {
            return { success: false, message: "Oyuncu adı zaten var." };
        }
        const newUser = {
            id: Date.now().toString(),
            username,
            password,
            role: 'user',
            level: 1,
            xp: 0,
            badges: []
        };
        users.push(newUser);
        localStorage.setItem('kk_users', JSON.stringify(users));
        this.pushToFirebase('users', users); // Sync
        return { success: true, user: newUser };
    },

    getQuestions() {
        return JSON.parse(localStorage.getItem('kk_questions') || '[]');
    },

    addQuestion(question) {
        const questions = this.getQuestions();
        question.id = Date.now();
        if (!question.level) question.level = 1; // Default level
        questions.push(question);
        localStorage.setItem('kk_questions', JSON.stringify(questions));
        this.pushToFirebase('questions', questions); // Sync
    },

    deleteQuestion(id) {
        let questions = this.getQuestions();
        questions = questions.filter(q => q.id !== id);
        localStorage.setItem('kk_questions', JSON.stringify(questions));
        this.pushToFirebase('questions', questions); // Sync
    },

    updateQuestion(id, updatedData) {
        let questions = this.getQuestions();
        const index = questions.findIndex(q => q.id === id);
        if (index >= 0) {
            questions[index] = { ...questions[index], ...updatedData };
            localStorage.setItem('kk_questions', JSON.stringify(questions));
            this.pushToFirebase('questions', questions); // Sync
        }
    },

    deleteAllQuestions() {
        localStorage.setItem('kk_questions', '[]');
        this.pushToFirebase('questions', []); // Sync
    },

    deleteUser(id) {
        let users = this.getUsers();
        // Don't delete admin
        const user = users.find(u => u.id === id);
        if (user && user.role === 'admin') return;

        users = users.filter(u => u.id !== id);
        localStorage.setItem('kk_users', JSON.stringify(users));
        this.pushToFirebase('users', users); // Sync
    },

    updateUserPassword(id, newPassword) {
        let users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex >= 0) {
            users[userIndex].password = newPassword;
            localStorage.setItem('kk_users', JSON.stringify(users));
            this.pushToFirebase('users', users); // Sync
            return true;
        }
        return false;
    },

    initBadges() {
        if (!localStorage.getItem('kk_badges')) {
            const rankNames = this.getRanks().map(r => r.name);
            const badges = rankNames.map((rank, index) => ({
                id: index + 1,
                name: `${rank} Rozeti`,
                description: "Bu rozet henüz kazanılmadı.",
                image: "assets/badges/default_badge.jpg"
            }));
            localStorage.setItem('kk_badges', JSON.stringify(badges));
        }
    },

    initRanks() {
        if (!localStorage.getItem('kk_ranks')) {
            const defaultRanks = [
                "Acemi Kaşif", "Mescid Kuşu", "Gazze Savunucusu", "Kudüs Sevdalısı",
                "Acemi Muhafız", "Miraç Yolcusu", "Aksa Bilgini", "Aksa Muhafızı",
                "Kudüs Mihmandarı", "Küçük Selahaddin"
            ].map((name, index) => ({
                id: index + 1,
                name: name
            }));
            localStorage.setItem('kk_ranks', JSON.stringify(defaultRanks));
        }
    },

    getRanks() {
        if (!localStorage.getItem('kk_ranks')) {
            this.initRanks();
        }
        return JSON.parse(localStorage.getItem('kk_ranks'));
    },

    updateRank(id, name) {
        let ranks = this.getRanks();
        const index = ranks.findIndex(r => r.id === id);
        if (index >= 0) {
            ranks[index].name = name;
            localStorage.setItem('kk_ranks', JSON.stringify(ranks));
            // Ranks usually static, but if synced:
            // this.pushToFirebase('ranks', ranks);
            return true;
        }
        return false;
    },

    initMessages() {
        if (!localStorage.getItem('kk_messages')) {
            localStorage.setItem('kk_messages', '[]');
        }
    },

    getMessages() {
        if (!localStorage.getItem('kk_messages')) {
            this.initMessages();
        }
        return JSON.parse(localStorage.getItem('kk_messages'));
    },

    addMessage(message) {
        const messages = this.getMessages();
        message.id = Date.now();
        message.timestamp = new Date().toISOString();
        messages.push(message);
        localStorage.setItem('kk_messages', JSON.stringify(messages));
        this.pushToFirebase('messages', messages); // Sync
    },

    deleteMessage(id) {
        let messages = this.getMessages();
        messages = messages.filter(m => m.id !== id);
        localStorage.setItem('kk_messages', JSON.stringify(messages));
        this.pushToFirebase('messages', messages); // Sync
    },

    deleteAllMessages() {
        localStorage.setItem('kk_messages', '[]');
        this.pushToFirebase('messages', []); // Sync
    },

    getSettings() {
        return JSON.parse(localStorage.getItem('kk_game_settings') || '{"minutes": 5, "seconds": 0}');
    },

    saveSettings(settings) {
        localStorage.setItem('kk_game_settings', JSON.stringify(settings));
        this.pushToFirebase('settings', settings); // Sync
    },

    getBadges() {
        return JSON.parse(localStorage.getItem('kk_badges') || '[]');
    },

    updateBadge(id, updatedData) {
        const badges = this.getBadges();
        const badgeIndex = badges.findIndex(b => b.id === id);
        if (badgeIndex >= 0) {
            badges[badgeIndex] = { ...badges[badgeIndex], ...updatedData };
            localStorage.setItem('kk_badges', JSON.stringify(badges));
            // this.pushToFirebase('badges', badges);
            return true;
        }
        return false;
    },

    // About Us Management
    getAboutUs() {
        const defaultText = "Kudüs Kaşifleri, Mescid-i Aksa ve Kudüs hakkında farkındalık oluşturmak amacıyla hazırlanmış bir bilgi yarışmasıdır.";
        return JSON.parse(localStorage.getItem('kk_about_us') || JSON.stringify(defaultText));
    },

    saveAboutUs(text) {
        localStorage.setItem('kk_about_us', JSON.stringify(text));
        this.pushToFirebase('aboutUs', text);
    },

    // Bot Users for Leaderboard
    initBotUsers() {
        const botNames = [
            'Ahmet Yılmaz', 'Mehmet Kaya', 'Ayşe Demir', 'Fatma Çelik',
            'Mustafa Şahin', 'Zeynep Yıldız', 'Ali Aydın', 'Elif Öztürk',
            'Hasan Arslan', 'Merve Doğan', 'İbrahim Kılıç', 'Selin Koç',
            'Ömer Şimşek', 'Büşra Yılmaz', 'Yunus Çetin', 'Esra Özdemir',
            'Murat Aksoy', 'Hatice Polat', 'Emre Güneş', 'Rabia Kara'
        ];

        const users = this.getUsers();

        botNames.forEach((name, index) => {
            // Random stats for realistic leaderboard
            const totalQuestions = Math.floor(Math.random() * 50) + 20; // 20-70 questions
            const correctRate = 0.6 + Math.random() * 0.35; // 60-95% correct
            const totalCorrect = Math.floor(totalQuestions * correctRate);
            const totalWrong = totalQuestions - totalCorrect;
            const xp = totalCorrect * 10 + Math.floor(Math.random() * 50);
            const level = Math.min(10, Math.floor(xp / 100) + 1);

            // Average time per question (faster players get better rank)
            const avgTimePerQuestion = 5 + Math.random() * 15; // 5-20 seconds
            const totalTime = Math.floor(totalQuestions * avgTimePerQuestion);

            users.push({
                username: name,
                password: 'bot123',
                xp: xp,
                level: level,
                badges: [],
                role: 'user',
                isBot: true,
                totalQuestions: totalQuestions,
                totalCorrect: totalCorrect,
                totalWrong: totalWrong,
                totalTime: totalTime, // in seconds
                lastPlayed: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000) // within last week
            });
        });

        localStorage.setItem('kk_users', JSON.stringify(users));
        localStorage.setItem('kk_bots_initialized', 'true');
    }
};

DataManager.init();
