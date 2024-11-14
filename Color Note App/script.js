document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const authForms = document.getElementById('auth-forms');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const notesApp = document.getElementById('notes-app');
    const userEmail = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Notes Elements
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const addNoteBtn = document.getElementById('add-note');
    const notesContainer = document.getElementById('notes');
    const colorPicker = document.querySelector('.color-picker');
    
    let selectedColor = '#ffeb3b';
    let currentUser = null;
    
    // Check if user is logged in
    const checkAuth = () => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
            showNotesApp();
        } else {
            showAuthForms();
        }
    };
    
    // Show/Hide Functions
    const showNotesApp = () => {
        authForms.classList.add('hidden');
        notesApp.classList.remove('hidden');
        userEmail.textContent = currentUser.email;
        renderNotes();
    };
    
    const showAuthForms = () => {
        authForms.classList.remove('hidden');
        notesApp.classList.add('hidden');
        currentUser = null;
    };
    
    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.tab === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });
    
    // Auth Event Listeners
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        if (users[email] && users[email].password === password) {
            currentUser = { email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showNotesApp();
            loginForm.reset();
        } else {
            alert('Invalid email or password');
        }
    });
    
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || {};
        
        if (users[email]) {
            alert('Email already registered');
            return;
        }
        
        users[email] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = { email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotesApp();
        registerForm.reset();
    });
    
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        showAuthForms();
    });
    
    // Notes Functionality
    colorPicker.addEventListener('click', (e) => {
        if (e.target.classList.contains('color')) {
            document.querySelectorAll('.color').forEach(color => {
                color.classList.remove('selected');
            });
            e.target.classList.add('selected');
            selectedColor = e.target.dataset.color;
        }
    });
    
    addNoteBtn.addEventListener('click', () => {
        if (noteTitle.value.trim() === '' || noteContent.value.trim() === '') {
            alert('Please fill in both title and content!');
            return;
        }
        
        const note = {
            id: Date.now(),
            title: noteTitle.value,
            content: noteContent.value,
            color: selectedColor,
            date: new Date().toLocaleString()
        };
        
        const notes = getNotes();
        notes.push(note);
        saveNotes(notes);
        renderNotes();
        
        noteTitle.value = '';
        noteContent.value = '';
    });
    
    notesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const noteId = parseInt(e.target.dataset.id);
            const notes = getNotes().filter(note => note.id !== noteId);
            saveNotes(notes);
            renderNotes();
        }
    });
    
    // Notes Helper Functions
    function getNotes() {
        const userNotes = localStorage.getItem(`notes_${currentUser.email}`);
        return userNotes ? JSON.parse(userNotes) : [];
    }
    
    function saveNotes(notes) {
        localStorage.setItem(`notes_${currentUser.email}`, JSON.stringify(notes));
    }
    
    function renderNotes() {
        const notes = getNotes();
        notesContainer.innerHTML = notes.map(note => `
            <div class="note" style="background-color: ${note.color}">
                <button class="delete-btn" data-id="${note.id}">×</button>
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <small>${note.date}</small>
            </div>
        `).join('');
    }
    
    // Select default color
    document.querySelector('.color').classList.add('selected');
    
    // Initial auth check
    checkAuth();
});