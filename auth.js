(() => {
  function $(id) {
    return document.getElementById(id);
  }

  const STORAGE_KEY = 'game-users';
  const authForm = $('authForm');
  const formTitle = $('formTitle');
  const actionButton = $('actionButton');
  const toggleAuth = $('toggleAuth');
  const formMessage = $('formMessage');
  const usernameInput = $('usernameInput');
  const passwordInput = $('passwordInput');

  let isLogin = true;

  toggleAuth.addEventListener('click', () => {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? 'Login' : 'Register';
    actionButton.textContent = isLogin ? 'Login' : 'Register';
    toggleAuth.textContent = isLogin
      ? "Don't have an account? Register here."
      : "Already have an account? Login here.";
    clearMessage();
    authForm.reset();
  });

  function showMessage(text, type = 'error') {
    formMessage.textContent = text;
    formMessage.className = 'message ' + (type === 'success' ? 'success' : 'error');
  }

  function clearMessage() {
    formMessage.textContent = '';
    formMessage.className = 'message';
  }

  function loadUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function registerUser(username, password) {
    const users = loadUsers();
    if (users[username]) return false;
    users[username] = btoa(password);
    saveUsers(users);
    return true;
  }

  function authenticateUser(username, password) {
    const users = loadUsers();
    if (!users[username]) return false;
    return atob(users[username]) === password;
  }

  authForm.addEventListener('submit', e => {
    e.preventDefault();
    clearMessage();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showMessage('Please fill out both fields.');
      return;
    }

    if (password.length < 4) {
      showMessage('Password must be at least 4 characters.');
      return;
    }

    if (isLogin) {
      if (authenticateUser(username, password)) {
        localStorage.setItem('loggedInUser', username);
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'open.html';
        }, 800);
      } else {
        showMessage('Invalid username or password.');
      }
    } else {
      if (registerUser(username, password)) {
        showMessage('Registration successful! You can now log in.', 'success');
        isLogin = true;
        formTitle.textContent = 'Login';
        actionButton.textContent = 'Login';
        toggleAuth.textContent = "Don't have an account? Register here.";
        authForm.reset();
      } else {
        showMessage('Username already exists.');
      }
    }
  });
})();