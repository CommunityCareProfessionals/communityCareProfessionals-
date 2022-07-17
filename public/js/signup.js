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
