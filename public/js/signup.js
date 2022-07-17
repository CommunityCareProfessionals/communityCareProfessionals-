const selectRoleHandler = async (btn) => {
  const role = btn.getAttribute('data-role');

  const btnSelectRole = document.querySelector('#select_role');

  btnSelectRole.textContent = 'Join as a service ' + role;
  btnSelectRole.disabled = false;
  btnSelectRole.setAttribute('data-role', role);
};

const gotoSignup = (btn) => {
  document.location.replace('/register/?type=' + btn.getAttribute('data-role'));
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const first_name = document.querySelector('#firstname-signup').value.trim();
  const last_name = document.querySelector('#lastname-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const type = document.querySelector('#type-signup').value;

  console.log(first_name, last_name, email, password, type, 'signupdata');

  if (first_name && last_name && email && password && type) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        type,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log(response);

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
      console.log('fail');
    }
  }
};

if (document.querySelector('.signup-form')) {
  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);
}
