const App = {
    init() {
        // Intro Sequence
        const logo = document.getElementById('splash-logo');
        const mascot = document.getElementById('intro-mascot');
        const bubble = document.getElementById('intro-bubble');
        const btnNext = document.getElementById('btn-intro-next');

        // Define intro sequence first
        let introStep = 0;

        const introSequence = [
            {
                img: "assets/karakter-ifadeleri/krk-selam.png", // Default image for first step
                text: "Selamun Aleykum.<br>Ben Selahaddin.",
                buttonText: "Aleykum Selam"
            },
            {
                img: "assets/karakter-ifadeleri/krk-dusunme.png",
                text: () => {
                    // Check if user is logged in
                    const currentUser = Auth.currentUser;
                    if (currentUser && currentUser.username) {
                        return `Ben senin sanal arkadaşınım <span style="color: #e74c3c; font-weight: bold;">${currentUser.username}</span>. Sana ilk kıblemiz Mescid-i Aksa ile ilgili yeni bilgiler öğreteceğim. Tanıştığımıza memnun oldum :)`;
                    } else {
                        return "Ben senin sanal arkadaşım. Sana ilk kıblemiz Mescid-i Aksa ile ilgili yeni bilgiler öğreteceğim. Tanıştığımıza memnun oldum :)";
                    }
                },
                buttonText: "Ben de memnun oldum :)"
            },
            {
                img: "assets/karakter-ifadeleri/krk-bayrak.png",
                text: "Bu soruları Hucurat Hareketi Derneği senin için hazırladı. Soruları bil, bildikçe rütbe ve rozet kazan!",
                buttonText: "Süper!"
            },
            {
                img: "assets/karakter-ifadeleri/krk-mutlu.png",
                text: "Hazırsan başlayalım!",
                buttonText: "Haydi, Bismillah!"
            }
        ];

        // 1. Logo Animation (CSS handles fade in)
        setTimeout(() => {
            logo.classList.add('logo-moved');
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('transition');
            }
        }, 2500);

        // 2. Mascot Appears
        setTimeout(() => {
            mascot.classList.remove('mascot-hidden');
            mascot.classList.add('mascot-visible');
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('transition');
            }
        }, 3500);

        // 3. Show bubble with first message
        setTimeout(() => {
            // Initialize first message
            const firstContent = introSequence[0];
            mascot.src = firstContent.img;
            const text = typeof firstContent.text === 'function' ? firstContent.text() : firstContent.text;
            document.querySelector('#intro-bubble p').innerHTML = text;
            btnNext.textContent = firstContent.buttonText;

            bubble.classList.add('visible');
            introStep++; // Move to next step so button click shows second message
        }, 4700);

        // 5. Handle "Devam Et" / Dialogue Steps
        btnNext.onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            if (introStep < introSequence.length) {
                // 1. Hide elements
                mascot.classList.remove('mascot-visible');
                mascot.classList.add('mascot-hidden'); // Ensure hidden class is applied for fade out
                bubble.classList.remove('visible');

                setTimeout(() => {
                    // 2. Change Content
                    const content = introSequence[introStep];
                    mascot.src = content.img;

                    // Handle text as function or string
                    const text = typeof content.text === 'function' ? content.text() : content.text;
                    document.querySelector('#intro-bubble p').innerHTML = text;
                    btnNext.textContent = content.buttonText;

                    // 3. Show elements
                    mascot.classList.remove('mascot-hidden');
                    mascot.classList.add('mascot-visible');
                    if (typeof SoundManager !== 'undefined') {
                        SoundManager.play('transition');
                    }
                    setTimeout(() => {
                        bubble.classList.add('visible');
                    }, 300); // Slight delay for bubble after mascot starts appearing

                    introStep++;
                }, 300); // Wait for fade out
            } else {
                // End Intro
                if (Auth.isLoggedIn()) {
                    this.showScreen('dashboard-screen');
                    this.updateDashboard();
                } else {
                    this.showScreen('auth-screen');
                }
            }
        };

        // Skip Intro
        document.getElementById('btn-skip-intro').onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            if (Auth.isLoggedIn()) {
                this.showScreen('dashboard-screen');
                this.updateDashboard();
            } else {
                this.showScreen('auth-screen');
            }
        };

        this.setupEventListeners();
    },

    setupEventListeners() {
        // Auth Toggles
        document.getElementById('show-register').onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('register-form').classList.remove('hidden');
        };
        document.getElementById('show-login').onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            document.getElementById('register-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        };

        // Login
        document.getElementById('btn-login').onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            const u = document.getElementById('login-username').value;
            const p = document.getElementById('login-password').value;
            const remember = document.getElementById('login-remember').checked;

            const res = Auth.login(u, p, remember);
            if (res.success) {
                this.showScreen('dashboard-screen');
                this.updateDashboard();
            } else {
                this.showError(res.message);
            }
        };

        // Message Modal Close
        document.getElementById('btn-close-msg').onclick = () => {
            document.getElementById('message-modal').classList.add('hidden');
        };

        // About Us Modal
        document.getElementById('btn-about-us').onclick = () => {
            if (typeof SoundManager !== 'undefined') SoundManager.play('click');
            const text = DataManager.getAboutUs();
            document.getElementById('about-us-text').textContent = text;
            document.getElementById('about-us-modal').classList.remove('hidden');
        };

        document.getElementById('btn-close-about').onclick = () => {
            document.getElementById('about-us-modal').classList.add('hidden');
        };


        // Register
        document.getElementById('btn-register').onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            const u = document.getElementById('reg-username').value;
            const p = document.getElementById('reg-password').value;
            if (!u || !p) {
                alert("Oyuncu adı ve şifre gerekli.");
                return;
            }
            const res = Auth.register(u, p);
            if (res.success) {
                alert("Kayıt başarılı! Giriş yapabilirsin.");
                document.getElementById('show-login').click();
            } else {
                alert(res.message);
            }
        };

        // Dashboard
        document.getElementById('btn-logout').onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            Auth.logout();
            this.showScreen('auth-screen');
        };
        // Start Game
        const btnStart = document.getElementById('btn-start-game');
        btnStart.onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }

            // Select random mascot
            const mascots = [
                'krk-selam.png',
                'krk-bayrak.png',
                'krk-dusunme.png',
                'krk-fikir.png',
                'krk-hosgeldin.png',
                'krk-kararli.png',
                'krk-zafer.png'
            ];
            const randomMascot = mascots[Math.floor(Math.random() * mascots.length)];

            // Show loading overlay
            const overlay = document.getElementById('loading-overlay');
            const mascot = document.getElementById('loading-mascot');
            mascot.src = `assets/karakter-ifadeleri/${randomMascot}`;

            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.add('visible'), 10);

            // Wait for mascot animation, then transition to game
            setTimeout(() => {
                overlay.classList.add('fade-out');

                setTimeout(() => {
                    this.showScreen('game-screen');
                    Game.start();

                    // Reset overlay
                    overlay.classList.remove('visible', 'fade-out');
                    overlay.classList.add('hidden');
                }, 500);
            }, 1500);
        };
        document.getElementById('btn-go-admin').onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            this.showScreen('admin-screen');
            Admin.init();
        };

        // Quit Game with Confirmation
        document.getElementById('btn-quit-game').onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }

            // Show confirmation using result modal
            const modal = document.getElementById('result-modal');
            const mascot = document.getElementById('result-mascot');
            const title = document.getElementById('result-title');
            const msg = document.getElementById('result-message');
            const btn = document.getElementById('btn-result-home');

            mascot.src = "assets/karakter-ifadeleri/krk-uzgun.png";
            title.textContent = "Oyundan Çıkmak İstiyor musun?";
            msg.textContent = "İlerleme kaydedilecek.";
            btn.textContent = "Evet, Çık";

            modal.classList.remove('hidden');

            btn.onclick = () => {
                modal.classList.add('hidden');
                btn.textContent = "Ana Sayfaya Dön"; // Reset button text
                Game.stopTimer(); // Stop the timer
                this.showScreen('dashboard-screen');
                this.updateDashboard();
            };
        };

        // Admin Button
        const btnAdmin = document.getElementById('btn-admin');
        btnAdmin.onclick = () => {
            App.showScreen('admin-screen');
            Admin.init();
        };

        // Message Modal Logic
        const messageModal = document.getElementById('message-modal');
        const btnMessageBox = document.getElementById('btn-message-box');
        const btnCloseMessage = document.getElementById('btn-close-message');
        const btnSendMessage = document.getElementById('btn-send-message');
        const messageText = document.getElementById('message-text');

        btnMessageBox.onclick = () => {
            messageModal.classList.remove('hidden');
        };

        btnCloseMessage.onclick = () => {
            messageModal.classList.add('hidden');
        };

        btnSendMessage.onclick = () => {
            const text = messageText.value.trim();
            if (!text) {
                alert("Lütfen bir mesaj yazın.");
                return;
            }

            // Get Rank Name
            const ranks = DataManager.getRanks();
            const rankIndex = Math.max(0, Math.min(Auth.currentUser.level - 1, ranks.length - 1));
            const rankName = ranks[rankIndex].name;

            DataManager.addMessage({
                username: Auth.currentUser.username,
                rank: rankName,
                text: text
            });

            alert("Mesajınız iletildi! Teşekkür ederiz.");
            messageText.value = '';
            messageModal.classList.add('hidden');
        };
        // Admin
        document.getElementById('btn-exit-admin').onclick = () => {
            this.showScreen('dashboard-screen');
        };

        // Ranks Modal Logic
        const ranksModal = document.getElementById('ranks-modal');
        const btnShowRanks = document.getElementById('btn-show-ranks');
        const btnCloseRanks = document.getElementById('btn-close-ranks');
        const ranksList = document.getElementById('ranks-list');

        btnShowRanks.onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            ranksList.innerHTML = '';
            const ranks = DataManager.getRanks();

            ranks.forEach((r, i) => {
                const item = document.createElement('div');
                const isCurrent = (i + 1) === Auth.currentUser.level;
                item.className = `rank-item ${isCurrent ? 'active' : ''}`;
                item.innerHTML = `
                    <div class="rank-number">${i + 1}</div>
                    <span>${r.name}</span>
                    ${isCurrent ? ' <span style="font-size:0.8rem; margin-left:auto">(Sen)</span>' : ''}
                `;
                ranksList.appendChild(item);
            });
            ranksModal.classList.remove('hidden');
        };

        btnCloseRanks.onclick = () => {
            ranksModal.classList.add('hidden');
        };

        // Badges Modal Logic
        const badgesModal = document.getElementById('badges-modal');
        const btnShowBadges = document.getElementById('btn-show-badges');
        const btnCloseBadges = document.getElementById('btn-close-badges');
        const badgesList = document.getElementById('badges-list');

        btnShowBadges.onclick = () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('click');
            }
            badgesList.innerHTML = '';
            const allBadges = DataManager.getBadges();
            const userLevel = Auth.currentUser.level;

            allBadges.forEach(badge => {
                const isEarned = badge.id <= userLevel;
                const card = document.createElement('div');
                card.className = `badge-card ${isEarned ? 'earned' : 'locked'}`;

                card.innerHTML = `
                    <img src="${badge.image}" class="badge-img" alt="${badge.name}" onclick="App.showZoomedImage('${badge.image}')" style="cursor:pointer;">
                    <div class="badge-info">
                        <div class="badge-title">${badge.name}</div>
                        <div class="badge-desc">${badge.description}</div>
                        ${isEarned ? '<div style="color:green; font-weight:bold; font-size:0.8rem; margin-top:5px;">✓ Kazanıldı</div>' : '<div style="color:red; font-weight:bold; font-size:0.8rem; margin-top:5px;">🔒 Kilitli</div>'}
                    </div>
                `;
                badgesList.appendChild(card);
            });
            badgesModal.classList.remove('hidden');
        };

        btnCloseBadges.onclick = () => {
            badgesModal.classList.add('hidden');
        };

        // Close Modals on Outside Click
        window.onclick = (event) => {
            if (event.target == ranksModal) {
                ranksModal.classList.add('hidden');
            }
            if (event.target == badgesModal) {
                badgesModal.classList.add('hidden');
            }
            if (event.target == document.getElementById('message-modal')) {
                document.getElementById('message-modal').classList.add('hidden');
            }
            if (event.target == document.getElementById('image-zoom-modal')) {
                document.getElementById('image-zoom-modal').classList.add('hidden');
            }
        };
    },

    showZoomedImage(src) {
        const modal = document.getElementById('image-zoom-modal');
        const img = document.getElementById('zoomed-image');
        img.src = src;
        modal.classList.remove('hidden');

        // Close on click anywhere
        modal.onclick = () => {
            modal.classList.add('hidden');
        };
    },

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
    },

    updateDashboard() {
        if (!Auth.currentUser) return;

        // Get Ranks from DataManager
        const ranks = DataManager.getRanks();

        // Admin is always max rank
        if (Auth.isAdmin()) {
            Auth.currentUser.level = 10;
        }

        // Cap level at 10
        if (Auth.currentUser.level > 10) Auth.currentUser.level = 10;

        document.getElementById('user-name-display').textContent = Auth.currentUser.username;
        // Stats removed from UI
        // document.getElementById('level-display').textContent = Auth.currentUser.level;
        // const xp = Auth.currentUser.xp % 100;
        // document.getElementById('xp-bar').style.width = `${xp}%`;

        // Rank Name
        const rankIndex = Math.max(0, Math.min(Auth.currentUser.level - 1, ranks.length - 1));
        const rankName = ranks[rankIndex].name;
        document.getElementById('user-rank-display').textContent = rankName;

        // Update Stats Cards
        const currentRankDisplay = document.getElementById('current-rank-display');
        if (currentRankDisplay) {
            currentRankDisplay.textContent = rankName;
        }

        const earnedBadgesDisplay = document.getElementById('earned-badges-display');
        if (earnedBadgesDisplay) {
            const totalBadges = DataManager.getBadges().length;
            const userBadges = Auth.currentUser.badges ? Auth.currentUser.badges.length : 0;
            earnedBadgesDisplay.textContent = `${userBadges}/${totalBadges} Kazanıldı`;
        }

        // Update Stats Summary
        if (document.getElementById('stat-total')) {
            const u = Auth.currentUser;
            document.getElementById('stat-total').textContent = u.totalQuestions || 0;
            document.getElementById('stat-correct').textContent = u.totalCorrect || 0;
            document.getElementById('stat-wrong').textContent = u.totalWrong || 0;
            document.getElementById('stat-score').textContent = u.xp || 0;

            // Next Rank Progress
            const xp = u.xp || 0;
            const xpForNextLevel = 100;
            const currentLevelXP = xp % xpForNextLevel;
            const remaining = xpForNextLevel - currentLevelXP;

            if (u.level >= 10) {
                document.getElementById('next-rank-points').textContent = "Maksimum Seviye";
                document.getElementById('next-rank-bar').style.width = "100%";
            } else {
                document.getElementById('next-rank-points').textContent = `${remaining} Puan kaldı`;
                const progressPercent = (currentLevelXP / xpForNextLevel) * 100;
                document.getElementById('next-rank-bar').style.width = `${progressPercent}%`;
            }
        }

        // Update Badges Slider
        const slider = document.getElementById('dashboard-badges-slider');
        if (slider) {
            slider.innerHTML = '';
            const allBadges = DataManager.getBadges();
            const userBadges = Auth.currentUser.badges || [];

            allBadges.forEach(badge => {
                const isEarned = userBadges.some(b => String(b) === String(badge.id));

                const div = document.createElement('div');
                div.className = `badge-slide-item ${isEarned ? '' : 'locked'}`;
                div.innerHTML = `
                    <div class="badge-slide-img-container">
                        <img src="${badge.image}" alt="${badge.name}">
                    </div>
                    <span class="badge-slide-name">${badge.name}</span>
                `;
                slider.appendChild(div);
            });
        }

        // Admin Button
        const btnAdmin = document.getElementById('btn-admin');
        if (Auth.isAdmin()) {
            btnAdmin.classList.remove('hidden');
        } else {
            btnAdmin.classList.add('hidden');
        }

        // Update Header Badge (Latest Earned)
        const headerBadge = document.getElementById('header-latest-badge');
        const allBadges = DataManager.getBadges();
        // User level corresponds to badge ID (e.g. Level 1 = Badge 1)
        // So the latest earned badge is the one with ID == Level
        const latestBadge = allBadges.find(b => b.id === Auth.currentUser.level);

        if (latestBadge) {
            headerBadge.src = latestBadge.image;
            headerBadge.classList.remove('hidden');
        } else {
            headerBadge.classList.add('hidden');
        }
    },

    showError(message) {
        const modal = document.getElementById('message-modal');
        const text = document.getElementById('msg-text');
        const mascot = document.getElementById('msg-mascot');
        const bubble = modal.querySelector('.speech-bubble');

        text.textContent = message;
        mascot.src = "assets/karakter-ifadeleri/krk-uzgun.png";

        if (typeof SoundManager !== 'undefined') {
            SoundManager.play('wrong');
        }

        modal.classList.remove('hidden');
        // Slight delay to allow modal to display before animating bubble (optional, but good for transition)
        setTimeout(() => {
            bubble.classList.add('visible');
        }, 10);
    }
};

// Start App
window.onload = () => App.init();
