
const DataManager = {
    init() {
        let users = JSON.parse(localStorage.getItem('kk_users') || '[]');

        // Ensure Admin Exists or Update
        let adminUser = users.find(u => u.role === 'admin');

        if (!adminUser) {
            adminUser = {
                id: 'admin',
                username: 'fatihguzel',
                password: 'Fatih5634',
                role: 'admin',
                level: 10,
                xp: 0,
                badges: []
            };
            users.push(adminUser);
        } else {
            // Force update admin username and level
            adminUser.username = 'fatihguzel';
            adminUser.password = 'Fatih5634'; // Ensure password is updated if it exists
            adminUser.level = 10;
        }
        localStorage.setItem('kk_users', JSON.stringify(users));

        // Initialize Badges
        this.initBadges();

        if (!localStorage.getItem('kk_questions')) {
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
        }
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
    },

    deleteQuestion(id) {
        let questions = this.getQuestions();
        questions = questions.filter(q => q.id !== id);
        localStorage.setItem('kk_questions', JSON.stringify(questions));
    },

    updateQuestion(id, updatedData) {
        let questions = this.getQuestions();
        const index = questions.findIndex(q => q.id === id);
        if (index >= 0) {
            questions[index] = { ...questions[index], ...updatedData };
            localStorage.setItem('kk_questions', JSON.stringify(questions));
        }
    },

    deleteAllQuestions() {
        localStorage.setItem('kk_questions', '[]');
    },

    deleteUser(id) {
        let users = this.getUsers();
        // Don't delete admin
        const user = users.find(u => u.id === id);
        if (user && user.role === 'admin') return;

        users = users.filter(u => u.id !== id);
        localStorage.setItem('kk_users', JSON.stringify(users));
    },

    updateUserPassword(id, newPassword) {
        let users = this.getUsers();
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex >= 0) {
            users[userIndex].password = newPassword;
            localStorage.setItem('kk_users', JSON.stringify(users));
            return true;
        }
        return false;
    },

    initBadges() {
        if (!localStorage.getItem('kk_badges')) {
            // Use getRanks if available, otherwise default
            const rankNames = this.getRanks().map(r => r.name);

            const badges = rankNames.map((rank, index) => ({
                id: index + 1,
                name: `${rank} Rozeti`,
                description: "Bu rozet henüz kazanılmadı.",
                image: "assets/badges/default_badge.jpg" // Placeholder
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
    },

    deleteMessage(id) {
        let messages = this.getMessages();
        messages = messages.filter(m => m.id !== id);
        localStorage.setItem('kk_messages', JSON.stringify(messages));
    },

    deleteAllMessages() {
        localStorage.setItem('kk_messages', '[]');
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
            return true;
        }
        return false;
    }
};

DataManager.init();
DataManager.initRanks();
