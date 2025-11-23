const Auth = {
    currentUser: null,

    init() {
        // Check LocalStorage (Persistent)
        let storedUser = localStorage.getItem('kk_session');

        // Check SessionStorage (Temporary)
        if (!storedUser) {
            storedUser = sessionStorage.getItem('kk_session');
        }

        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
        }
    },

    login(username, password, rememberMe) {
        const user = DataManager.getUser(username);
        if (!user) {
            return { success: false, message: "Kullanıcı adın yanlış!" };
        }
        if (user.password !== password) {
            return { success: false, message: "Şifren yanlış!" };
        }

        this.currentUser = user;

        if (rememberMe) {
            localStorage.setItem('kk_session', JSON.stringify(user));
        } else {
            sessionStorage.setItem('kk_session', JSON.stringify(user));
        }

        return { success: true, user };
    },

    register(username, password) {
        return DataManager.registerUser(username, password);
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('kk_session');
        sessionStorage.removeItem('kk_session');
    },

    isLoggedIn() {
        return !!this.currentUser;
    },

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    },

    updateProgress(xpGained, correctCount = 0, wrongCount = 0, gameDuration = 0) {
        if (!this.currentUser) return;

        this.currentUser.xp += xpGained;

        // Initialize stats if not exist
        if (!this.currentUser.totalQuestions) this.currentUser.totalQuestions = 0;
        if (!this.currentUser.totalCorrect) this.currentUser.totalCorrect = 0;
        if (!this.currentUser.totalWrong) this.currentUser.totalWrong = 0;
        if (!this.currentUser.totalTime) this.currentUser.totalTime = 0;

        this.currentUser.totalQuestions += (correctCount + wrongCount);
        this.currentUser.totalCorrect += correctCount;
        this.currentUser.totalWrong += wrongCount;
        this.currentUser.totalTime += gameDuration;
        this.currentUser.lastPlayed = Date.now();

        // Level up logic (simple: every 100 xp = 1 level)
        const newLevel = Math.floor(this.currentUser.xp / 100) + 1;
        if (newLevel > this.currentUser.level) {
            this.currentUser.level = newLevel;
            // Unlock badge logic could go here
            if (newLevel === 2) this.currentUser.badges.push('first_step');
            if (newLevel === 5) this.currentUser.badges.push('explorer');
            if (newLevel === 10) this.currentUser.badges.push('master');
        }

        DataManager.saveUser(this.currentUser);
        localStorage.setItem('kk_session', JSON.stringify(this.currentUser));
    }
};

Auth.init();
