const Admin = {
    init() {
        this.setupTabs();
        this.loadQuestions();
        this.loadUsers();

        document.getElementById('btn-add-question').onclick = () => this.addQuestion();
    },

    setupTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                document.getElementById(`tab-${tabId}`).classList.add('active');

                if (tabId === 'questions') this.loadQuestions();
                if (tabId === 'users') this.loadUsers();
                if (tabId === 'badges') this.loadBadges();
                if (tabId === 'ranks') this.loadRanks();
                if (tabId === 'messages') this.loadMessages();
                if (tabId === 'settings') this.loadGameSettings();
            };
        });
    },

    loadMessages() {
        const list = document.getElementById('admin-messages-list');
        list.innerHTML = `
            <div style="margin-bottom: 20px; display: flex; justify-content: flex-end;">
                <button class="btn-small" style="background: #c0392b; color: white; padding: 10px 15px;" onclick="Admin.deleteAllMessages()">Tüm Mesajları Sil</button>
            </div>
        `;

        const messages = DataManager.getMessages().reverse(); // Show newest first

        if (messages.length === 0) {
            list.innerHTML += '<div style="text-align:center; color:#888;">Henüz mesaj yok.</div>';
            return;
        }

        messages.forEach(m => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.style.flexDirection = 'column';
            item.style.alignItems = 'flex-start';

            const date = new Date(m.timestamp).toLocaleString('tr-TR');

            item.innerHTML = `
                <div style="display:flex; justify-content:space-between; width:100%; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:5px;">
                    <div>
                        <span style="font-weight:bold; color:var(--color-blue-dark);">${m.username}</span>
                        <span style="font-size:0.8rem; color:#666; background:#eee; padding:2px 5px; border-radius:4px;">${m.rank}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:0.8rem; color:#999;">${date}</span>
                        <button class="btn-small" style="background:red; padding:2px 8px;" onclick="Admin.deleteMessage(${m.id})">Sil</button>
                    </div>
                </div>
                <div style="width:100%; color:#333; line-height:1.4;">
                    ${m.text}
                </div>
            `;
            list.appendChild(item);
        });
    },

    deleteMessage(id) {
        if (confirm("Bu mesajı silmek istediğine emin misin?")) {
            DataManager.deleteMessage(id);
            this.loadMessages();
        }
    },

    loadGameSettings() {
        const settings = DataManager.getSettings();
        document.getElementById('game-minutes').value = settings.minutes;
        document.getElementById('game-seconds').value = settings.seconds;

        // Load About Us text
        const aboutText = DataManager.getAboutUs();
        document.getElementById('admin-about-us-text').value = aboutText;
    },

    saveGameSettings() {
        const minutes = parseInt(document.getElementById('game-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('game-seconds').value) || 0;

        const settings = { minutes, seconds };
        DataManager.saveSettings(settings);
        alert('Oyun ayarları kaydedildi!');
    },

    saveAboutUsSettings() {
        const text = document.getElementById('admin-about-us-text').value;
        DataManager.saveAboutUs(text);
        alert('Biz Kimiz metni kaydedildi!');
    },

    deleteAllMessages() {
        if (confirm("DİKKAT! Tüm mesajlar silinecek. Bu işlem geri alınamaz!\nDevam etmek istediğinize emin misiniz?")) {
            const password = prompt("Güvenlik doğrulaması için Admin şifresini girin:");
            if (password === Auth.currentUser.password) {
                DataManager.deleteAllMessages();
                alert("Tüm mesajlar başarıyla silindi.");
                this.loadMessages();
            } else {
                alert("Hatalı şifre! İşlem iptal edildi.");
            }
        }
    },

    loadRanks() {
        const list = document.getElementById('admin-ranks-list');
        list.innerHTML = '';
        const ranks = DataManager.getRanks();

        ranks.forEach(r => {
            const item = document.createElement('div');
            item.className = 'admin-badge-item'; // Reuse badge item style for consistency
            item.innerHTML = `
                <div class="badge-preview-area" style="justify-content:center;">
                    <div style="font-size:2rem; font-weight:900; color:var(--color-blue-dark);">${r.id}</div>
                    <div style="font-size:0.8rem; color:#888;">Seviye</div>
                </div>
                
                <div class="badge-edit-area">
                    <div class="form-group">
                        <label>Rütbe Adı</label>
                        <input type="text" id="rank-name-${r.id}" value="${r.name}" class="form-control">
                    </div>

                    <button class="btn-save-badge" onclick="Admin.saveRank(${r.id})">Değişiklikleri Kaydet</button>
                </div>
            `;
            list.appendChild(item);
        });
    },

    saveRank(id) {
        const name = document.getElementById(`rank-name-${id}`).value;
        if (DataManager.updateRank(id, name)) {
            alert("Rütbe güncellendi!");
            this.loadRanks();
        } else {
            alert("Hata oluştu.");
        }
    },

    loadQuestions() {
        const list = document.getElementById('questions-list');
        const filterLevel = document.getElementById('filter-level-select') ? document.getElementById('filter-level-select').value : 'all';

        // Header with Excel buttons and Delete All
        list.innerHTML = `
            <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                <button class="btn-secondary" onclick="Admin.downloadTemplate()">Excel Şablonu İndir</button>
                <input type="file" id="excel-upload" accept=".xlsx, .xls" style="display: none;" onchange="Admin.handleExcelUpload(this)">
                <button class="btn-primary" onclick="document.getElementById('excel-upload').click()">Excel'den Soru Yükle</button>
                <button class="btn-small" style="background: #c0392b; color: white; padding: 10px 15px; margin-left: auto;" onclick="Admin.deleteAllQuestions()">Tüm Soruları Sil</button>
            </div>
        `;

        let questions = DataManager.getQuestions();

        // Filter
        if (filterLevel !== 'all') {
            questions = questions.filter(q => q.level == filterLevel);
        }

        if (questions.length === 0) {
            list.innerHTML += '<div style="text-align:center; color:#888;">Bu kriterlere uygun soru bulunamadı.</div>';
            return;
        }

        questions.forEach(q => {
            const item = document.createElement('div');
            item.className = 'list-item';
            // Find correct answer text for display
            const correctText = q.options[q.correct];

            item.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:5px; flex:1;">
                    <span style="font-weight:bold; color:var(--color-blue-dark);">[Seviye ${q.level || 1}]</span>
                    <span style="font-weight:bold;">${q.text}</span>
                    <span style="font-size:0.9rem; color:green;">Doğru: ${correctText}</span>
                </div>
                <div style="display:flex; gap:5px;">
                    <button class="btn-small" style="background:orange" onclick="Admin.editQuestion(${q.id})">Düzenle</button>
                    <button class="btn-small" style="background:red" onclick="Admin.deleteQuestion(${q.id})">Sil</button>
                </div>
            `;
            list.appendChild(item);
        });

        // Show Total Count
        const countDiv = document.createElement('div');
        countDiv.style.padding = '15px';
        countDiv.style.textAlign = 'right';
        countDiv.style.fontWeight = 'bold';
        countDiv.style.color = 'var(--color-blue-dark)';
        countDiv.style.borderTop = '2px solid #eee';
        countDiv.style.marginTop = '10px';
        countDiv.textContent = `Toplam Soru: ${questions.length}`;
        list.appendChild(countDiv);
    },

    downloadTemplate() {
        // Define headers
        const data = [
            ["Soru", "Doğru Cevap", "Yanlış Cevap 1", "Yanlış Cevap 2", "Yanlış Cevap 3", "Derece (1-10)"],
            ["Mescid-i Aksa neresidir?", "Kudüs", "Mekke", "Medine", "İstanbul", 1] // Example row
        ];

        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sorular");
        XLSX.writeFile(wb, "Soru_Sablonu.xlsx");
    },

    handleExcelUpload(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // Skip header row (index 0)
            let addedCount = 0;
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                if (!row || row.length < 6) continue;

                const text = row[0];
                const correct = row[1];
                const wrong1 = row[2];
                const wrong2 = row[3];
                const wrong3 = row[4];
                const level = parseInt(row[5]) || 1;

                if (text && correct && wrong1 && wrong2 && wrong3) {
                    // Shuffle options to find correct index
                    const options = [correct, wrong1, wrong2, wrong3];
                    // We need to keep track of which one is correct. 
                    // Let's just put correct at index 0 initially, then shuffle? 
                    // Actually, DataManager expects 'correct' to be an index (0-3).
                    // So let's shuffle the array and find the new index of the correct answer.

                    // Simple shuffle
                    const shuffledOptions = options
                        .map(value => ({ value, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }) => value);

                    const correctIndex = shuffledOptions.indexOf(correct);

                    DataManager.addQuestion({
                        text,
                        options: shuffledOptions,
                        correct: correctIndex,
                        level
                    });
                    addedCount++;
                }
            }

            alert(`${addedCount} soru başarıyla eklendi!`);
            this.loadQuestions();
            input.value = ''; // Reset input
        };
        reader.readAsArrayBuffer(file);
    },

    addQuestion() {
        const idInput = document.getElementById('edit-q-id');
        const isEdit = idInput.value !== '';

        const text = document.getElementById('new-q-text').value;
        const correctText = document.getElementById('new-q-correct-text').value;
        const wrong1 = document.getElementById('new-q-wrong1').value;
        const wrong2 = document.getElementById('new-q-wrong2').value;
        const wrong3 = document.getElementById('new-q-wrong3').value;
        const level = parseInt(document.getElementById('new-q-level').value);

        if (!text || !correctText || !wrong1 || !wrong2 || !wrong3) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }

        // Create options array: [Correct, W1, W2, W3]
        // We set correct index to 0. Game will shuffle.
        const options = [correctText, wrong1, wrong2, wrong3];

        const questionData = {
            text,
            options,
            correct: 0, // Always 0 because we put correctText first
            level
        };

        if (isEdit) {
            const id = parseInt(idInput.value);
            DataManager.updateQuestion(id, questionData);
            alert("Soru güncellendi!");
            this.cancelEdit();
        } else {
            DataManager.addQuestion(questionData);
            alert("Soru eklendi!");
            // Clear inputs
            this.clearForm();
        }

        this.loadQuestions();
    },

    editQuestion(id) {
        const questions = DataManager.getQuestions();
        const q = questions.find(q => q.id === id);
        if (!q) return;

        document.getElementById('edit-q-id').value = q.id;
        document.getElementById('form-title').textContent = "Soruyu Düzenle";
        document.getElementById('btn-add-question').textContent = "Güncelle";
        document.getElementById('btn-cancel-edit').classList.remove('hidden');

        document.getElementById('new-q-text').value = q.text;
        document.getElementById('new-q-level').value = q.level || 1;

        // We need to identify which option is correct and which are wrong
        // q.correct is the index
        const correctText = q.options[q.correct];
        const wrongOptions = q.options.filter((_, i) => i !== q.correct);

        document.getElementById('new-q-correct-text').value = correctText;
        document.getElementById('new-q-wrong1').value = wrongOptions[0] || '';
        document.getElementById('new-q-wrong2').value = wrongOptions[1] || '';
        document.getElementById('new-q-wrong3').value = wrongOptions[2] || '';

        // Scroll to form
        document.querySelector('.add-question-form').scrollIntoView({ behavior: 'smooth' });
    },

    cancelEdit() {
        document.getElementById('edit-q-id').value = '';
        document.getElementById('form-title').textContent = "Yeni Soru Ekle";
        document.getElementById('btn-add-question').textContent = "Ekle";
        document.getElementById('btn-cancel-edit').classList.add('hidden');
        this.clearForm();
    },

    clearForm() {
        document.getElementById('new-q-text').value = '';
        document.getElementById('new-q-correct-text').value = '';
        document.getElementById('new-q-wrong1').value = '';
        document.getElementById('new-q-wrong2').value = '';
        document.getElementById('new-q-wrong3').value = '';
        document.getElementById('new-q-level').value = '1';
    },

    deleteQuestion(id) {
        if (confirm("Bu soruyu silmek istediğine emin misin?")) {
            DataManager.deleteQuestion(id);
            this.loadQuestions();
        }
    },

    deleteAllQuestions() {
        if (confirm("DİKKAT! Tüm sorular silinecek. Bu işlem geri alınamaz!\nDevam etmek istediğinize emin misiniz?")) {
            const password = prompt("Güvenlik doğrulaması için Admin şifresini girin:");
            if (password === Auth.currentUser.password) {
                DataManager.deleteAllQuestions();
                alert("Tüm sorular başarıyla silindi.");
                this.loadQuestions();
            } else {
                alert("Hatalı şifre! İşlem iptal edildi.");
            }
        }
    },

    loadUsers() {
        const list = document.getElementById('users-list');
        list.innerHTML = '';

        const searchInput = document.getElementById('user-search-input');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        let users = DataManager.getUsers();

        if (searchTerm) {
            users = users.filter(u => u.username.toLowerCase().includes(searchTerm));
        }

        if (users.length === 0) {
            list.innerHTML = '<div style="text-align:center; color:#888;">Oyuncu bulunamadı.</div>';
            return;
        }

        users.forEach(u => {
            const item = document.createElement('div');
            item.className = 'list-item';

            let actions = '<span>Admin</span>';
            if (u.role !== 'admin') {
                actions = `
                    <div style="display:flex; gap:5px;">
                        <button class="btn-small" style="background:orange" onclick="Admin.changePassword('${u.id}')">Şifre</button>
                        <button class="btn-small" style="background:red" onclick="Admin.deleteUser('${u.id}')">Sil</button>
                    </div>
                `;
            }

            item.innerHTML = `
                <span>${u.username} (Lvl: ${u.level})</span>
                ${actions}
            `;
            list.appendChild(item);
        });
    },

    deleteUser(id) {
        if (confirm("Bu kullanıcıyı silmek istediğine emin misin?")) {
            DataManager.deleteUser(id);
            this.loadUsers();
        }
    },

    addUser() {
        const usernameInput = document.getElementById('new-user-username');
        const passwordInput = document.getElementById('new-user-password');
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            alert("Lütfen oyuncu adı ve şifre girin.");
            return;
        }

        const result = DataManager.registerUser(username, password);
        if (result.success) {
            alert("Oyuncu başarıyla eklendi!");
            usernameInput.value = '';
            passwordInput.value = '';
            this.loadUsers();
        } else {
            alert("Hata: " + result.message);
        }
    },

    loadBadges() {
        const list = document.getElementById('admin-badges-list');
        list.innerHTML = '';
        const badges = DataManager.getBadges();

        badges.forEach(b => {
            const item = document.createElement('div');
            item.className = 'admin-badge-item';
            item.innerHTML = `
                <div class="badge-preview-area">
                    <img id="preview-img-${b.id}" src="${b.image}" class="badge-preview-img" alt="Badge">
                    <div style="font-size:0.8rem; color:#888; margin-top:5px;">ID: ${b.id}</div>
                </div>
                
                <div class="badge-edit-area">
                    <div class="form-group">
                        <label>Rozet Adı</label>
                        <input type="text" id="badge-name-${b.id}" value="${b.name}" class="form-control">
                    </div>

                    <div class="form-group">
                        <label>Görsel Bağlantısı (URL)</label>
                        <div class="image-input-group">
                            <input type="text" id="badge-img-${b.id}" value="${b.image}" class="form-control" placeholder="https://...">
                            <input type="file" id="file-input-${b.id}" accept="image/*" style="display:none" onchange="Admin.handleImageUpload(this, ${b.id})">
                            <button type="button" class="btn-upload" onclick="document.getElementById('file-input-${b.id}').click()">
                                Resim Seç
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Açıklama</label>
                        <textarea id="badge-desc-${b.id}" class="form-control" rows="2">${b.description}</textarea>
                    </div>

                    <button class="btn-save-badge" onclick="Admin.saveBadge(${b.id})">Değişiklikleri Kaydet</button>
                </div>
            `;
            list.appendChild(item);
        });
    },

    handleImageUpload(input, id) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Update URL input
                document.getElementById(`badge-img-${id}`).value = e.target.result;
                // Update Preview
                document.getElementById(`preview-img-${id}`).src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    },

    saveBadge(id) {
        const name = document.getElementById(`badge-name-${id}`).value;
        const image = document.getElementById(`badge-img-${id}`).value;
        const description = document.getElementById(`badge-desc-${id}`).value;

        if (DataManager.updateBadge(id, { name, image, description })) {
            alert("Rozet güncellendi!");
            this.loadBadges(); // Refresh to show updated preview
        } else {
            alert("Hata oluştu.");
        }
    },

    changePassword(id) {
        const newPass = prompt("Yeni şifreyi girin:");
        if (newPass) {
            DataManager.updateUserPassword(id, newPass);
            alert("Şifre güncellendi.");
        }
    }
};
