# Kudüs Kaşifleri - Verification Walkthrough

This document guides you through testing the "Kudüs Kaşifleri" game.

## 1. Initial Setup & Splash Screen
1.  Open `index.html` in your browser.
2.  **Verify**: You should see the blue splash screen with the animated logo.
3.  **Verify**: After ~2.5 seconds, it should automatically transition to the Login screen.

## 2. Authentication
### Register
1.  Click "Üye Ol" text to switch to the registration form.
2.  Enter a username (e.g., `testuser`) and password.
3.  Click "Kayıt Ol".
4.  **Verify**: You should see a success alert.

### Login
1.  Switch back to "Giriş Yap".
2.  Enter the credentials you just created.
3.  Click "Giriş Yap".
4.  **Verify**: You should be taken to the Dashboard.

## 3. Dashboard & Game Loop
1.  **Verify**: Dashboard shows your username, Level 1, and "Acemi" rank.
2.  Click "Oyuna Başla".
3.  **Verify**: Game screen appears with a question.
4.  Select the correct answer (e.g., "Kudüs" for "Mescid-i Aksa nerede?").
5.  **Verify**: Button turns green, score increases.
6.  Select a wrong answer on purpose for another question.
7.  **Verify**: Button turns red, correct answer is highlighted, and game ends.
8.  **Verify**: You return to Dashboard, and your XP bar has increased based on your score.

## 4. Admin Panel
1.  Logout and login with the default admin credentials:
    - Username: `admin`
    - Password: `123`
2.  **Verify**: You see an "Admin Paneli" button on the Dashboard.
3.  Click "Admin Paneli".
4.  **Questions Tab**:
    - Add a new question using the form.
    - **Verify**: The new question appears in the list below.
    - **Verify**: If you play the game again, this question can appear.
5.  **Users Tab**:
    - Click "Üyeler" tab.
    - **Verify**: You see `testuser` in the list.
    - Click "Banla" (Red button).
    - **Verify**: User is removed from the list (and effectively banned/deleted).

## 5. Responsive Design
1.  Resize your browser window to mobile size (or use DevTools Mobile View).
2.  **Verify**: The layout adapts, buttons remain clickable, and text is readable.
