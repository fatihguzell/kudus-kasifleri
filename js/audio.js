const SoundManager = {
    audioContext: null,
    enabled: true,

    init() {
        // Create AudioContext on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }, { once: true });
    },

    // Helper function to create oscillator
    createOscillator(frequency, type = 'sine') {
        if (!this.audioContext) return null;
        const oscillator = this.audioContext.createOscillator();
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        return oscillator;
    },

    // Helper function to create gain node
    createGain(initialValue = 1) {
        if (!this.audioContext) return null;
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = initialValue;
        return gainNode;
    },

    // Click sound - short beep
    playClick() {
        if (!this.enabled || !this.audioContext) return;

        const osc = this.createOscillator(800, 'sine');
        const gain = this.createGain(0.3);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    },

    // Transition sound - swoosh
    playTransition() {
        if (!this.enabled || !this.audioContext) return;

        const osc = this.createOscillator(400, 'sine');
        const gain = this.createGain(0.2);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    },

    // Correct answer - happy chime
    playCorrect() {
        if (!this.enabled || !this.audioContext) return;

        const frequencies = [523.25, 659.25, 783.99]; // C, E, G
        const startTime = this.audioContext.currentTime;

        frequencies.forEach((freq, i) => {
            const osc = this.createOscillator(freq, 'sine');
            const gain = this.createGain(0.2);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            const time = startTime + (i * 0.1);
            osc.start(time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
            osc.stop(time + 0.3);
        });
    },

    // Wrong answer - sad sound
    playWrong() {
        if (!this.enabled || !this.audioContext) return;

        const osc = this.createOscillator(200, 'sawtooth');
        const gain = this.createGain(0.3);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.4);
    },

    // Win sound - victory fanfare
    playWin() {
        if (!this.enabled || !this.audioContext) return;

        const melody = [523.25, 587.33, 659.25, 783.99, 1046.50]; // C, D, E, G, C
        const startTime = this.audioContext.currentTime;

        melody.forEach((freq, i) => {
            const osc = this.createOscillator(freq, 'triangle');
            const gain = this.createGain(0.25);

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            const time = startTime + (i * 0.15);
            osc.start(time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            osc.stop(time + 0.2);
        });
    },

    // Timer tick - subtle tick sound
    playTick() {
        if (!this.enabled || !this.audioContext) return;

        const osc = this.createOscillator(1000, 'square');
        const gain = this.createGain(0.05);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.05);
    },

    // Timer warning - urgent beep
    playWarning() {
        if (!this.enabled || !this.audioContext) return;

        const osc = this.createOscillator(880, 'square');
        const gain = this.createGain(0.2);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.15);
    },

    // Progress sound - level up
    playProgress() {
        if (!this.enabled || !this.audioContext) return;

        const osc = this.createOscillator(600, 'sine');
        const gain = this.createGain(0.15);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.2);
    },

    // Main play function
    play(soundName) {
        const soundMap = {
            'click': () => this.playClick(),
            'transition': () => this.playTransition(),
            'correct': () => this.playCorrect(),
            'wrong': () => this.playWrong(),
            'win': () => this.playWin(),
            'tick': () => this.playTick(),
            'warning': () => this.playWarning(),
            'progress': () => this.playProgress()
        };

        if (soundMap[soundName]) {
            soundMap[soundName]();
        }
    },

    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};

SoundManager.init();
