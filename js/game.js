const Game = {
    questions: [],
    currentIndex: 0,
    score: 0,
    totalQuestions: 10,
    timer: null,
    timeRemaining: 0,

    // Allowed mascots for questions (excluding happy/sad)
    questionMascots: [
        "krk-bayrak.png",
        "krk-dusunme.png",
        "krk-fikir.png",
        "krk-hosgeldin.png",
        "krk-kararli.png",
        "krk-selam.png",
        "krk-zafer-1.png",
        "krk-zafer.png"
    ],

    start() {
        // Get game settings from localStorage
        const settings = JSON.parse(localStorage.getItem('kk_game_settings') || '{"minutes": 5, "seconds": 0}');
        this.timeRemaining = (settings.minutes * 60) + settings.seconds;

        // Get questions based on user level
        const allQuestions = DataManager.getQuestions();
        const userLevel = Auth.currentUser.level;
        let levelQuestions = allQuestions.filter(q => q.level === userLevel);

        // Fallback if no questions for this level
        if (levelQuestions.length === 0) {
            levelQuestions = allQuestions.filter(q => q.level === 1);
        }

        // Select random 10 questions
        this.questions = this.shuffleArray([...levelQuestions]).slice(0, this.totalQuestions);
        this.currentIndex = 0;
        this.score = 0;
        this.updateScoreUI();
        this.startTimer();
        this.updateProgressBar();
        this.showQuestion();
    },

    startTimer() {
        this.stopTimer(); // Clear any existing timer
        const timerDisplay = document.getElementById('timer-display');
        const timerElement = document.getElementById('game-timer');

        // Display initial time immediately
        const initialMinutes = Math.floor(this.timeRemaining / 60);
        const initialSeconds = this.timeRemaining % 60;
        timerDisplay.textContent = `${String(initialMinutes).padStart(2, '0')}:${String(initialSeconds).padStart(2, '0')}`;

        this.timer = setInterval(() => {
            this.timeRemaining--;

            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            // Play tick sound every second
            if (typeof SoundManager !== 'undefined' && this.timeRemaining > 10) {
                SoundManager.play('tick');
            }

            // Warning when less than 30 seconds
            if (this.timeRemaining <= 30 && this.timeRemaining > 10) {
                timerElement.classList.add('warning');
            }

            // Urgent warning in last 10 seconds
            if (this.timeRemaining <= 10 && this.timeRemaining > 0) {
                timerElement.classList.add('warning');
                if (typeof SoundManager !== 'undefined') {
                    SoundManager.play('warning');
                }
            }

            // Time's up
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.endGame();
            }
        }, 1000);
    },

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        // Remove warning class when timer stops
        const timerElement = document.getElementById('game-timer');
        if (timerElement) {
            timerElement.classList.remove('warning');
        }
    },

    updateProgressBar() {
        const progressFill = document.getElementById('game-progress-fill');
        const currentQuestionSpan = document.getElementById('current-question');
        const progress = (this.currentIndex / this.totalQuestions) * 100;

        progressFill.style.width = `${progress}%`;
        currentQuestionSpan.textContent = this.currentIndex + 1;
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    showQuestion() {
        if (this.currentIndex >= this.questions.length || this.currentIndex >= this.totalQuestions) {
            this.endGame();
            return;
        }

        // Set Random Mascot for Question
        const randomMascot = this.questionMascots[Math.floor(Math.random() * this.questionMascots.length)];
        document.getElementById('game-mascot').src = `assets/karakter-ifadeleri/${randomMascot}`;

        const q = this.questions[this.currentIndex];
        const qText = document.getElementById('question-text');
        const optsContainer = document.getElementById('options-container');

        qText.textContent = q.text;
        optsContainer.innerHTML = '';

        // RUNTIME SHUFFLING
        // 1. Identify the correct answer string
        const correctOptionText = q.options[q.correct];

        // 2. Create a copy and shuffle
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);

        // 3. Find the new index of the correct answer
        const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

        shuffledOptions.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            // Pass the NEW correct index
            btn.onclick = () => this.handleAnswer(index, newCorrectIndex);
            optsContainer.appendChild(btn);
        });

        this.updateProgressBar();
    },

    handleAnswer(selected, correct) {
        // Disable all buttons
        const btns = document.querySelectorAll('.option-btn');
        btns.forEach(b => b.disabled = true);

        if (selected === correct) {
            btns[selected].classList.add('correct');
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('correct');
                setTimeout(() => SoundManager.play('progress'), 200);
            }
            this.score += 10;
            this.updateScoreUI();
            setTimeout(() => {
                this.currentIndex++;
                this.showQuestion();
            }, 1000);
        } else {
            btns[selected].classList.add('wrong');
            if (typeof SoundManager !== 'undefined') {
                SoundManager.play('wrong');
            }
            // Show Sad Mascot
            document.getElementById('game-mascot').src = "assets/karakter-ifadeleri/krk-uzgun.png";

            // Highlight correct one
            btns[correct].classList.add('correct');
            setTimeout(() => {
                this.endGame();
            }, 1500);
        }
    },

    updateScoreUI() {
        document.getElementById('current-score').textContent = this.score;
    },

    endGame() {
        this.stopTimer();
        const modal = document.getElementById('result-modal');
        const mascot = document.getElementById('result-mascot');
        const title = document.getElementById('result-title');
        const msg = document.getElementById('result-message');
        const btn = document.getElementById('btn-result-home');

        // Determine success (at least 70% correct)
        const successThreshold = this.totalQuestions * 0.7;
        if (this.score >= successThreshold * 10) {
            // Success
            SoundManager.play('win');
            mascot.src = "assets/karakter-ifadeleri/krk-mutlu.png";
            title.textContent = "Tebrikler!";
            msg.textContent = `Bölümü başarıyla tamamladın!\nSkorun: ${this.score}`;
        } else {
            // Failed
            SoundManager.play('wrong'); // Or a specific fail sound
            mascot.src = "assets/karakter-ifadeleri/krk-uzgun.png";
            title.textContent = "Oyun Bitti";
            msg.textContent = `Maalesef bilemedin.\nSkorun: ${this.score}`;
        }

        Auth.updateProgress(this.score);
        modal.classList.remove('hidden');

        btn.onclick = () => {
            modal.classList.add('hidden');
            App.showScreen('dashboard-screen');
            App.updateDashboard();
        };
    }
};
