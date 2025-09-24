let users = [];

fetch('users.json')
  .then(response => response.json())
  .then(data => {
    users = Array.isArray(data) ? data : [];
  })
  .catch(error => {
    console.error("Error loading user data:", error);
  });

document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  if (users.length === 0) {
    document.getElementById('error-message').textContent = 'User data not loaded yet. Please try again later.';
    return;
  }

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();


  const user = users.find(u => u.Username === username && u.Password === password);

  if (user) {
    localStorage.setItem('loggedprinter', JSON.stringify(user));
    window.location.href = 'Dashboard/';
  } else {
    document.getElementById('error-message').textContent = 'Invalid username or password';
  }
});

