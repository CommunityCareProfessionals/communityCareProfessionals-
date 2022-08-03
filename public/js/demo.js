switchDemoUser = async (e) => {
  const selectList = e.target.selectedOptions;

  if (selectList) {
    const email = selectList[0].getAttribute('data-email').trim();
    const password = selectList[0].getAttribute('data-password').trim();

    // Logout first before logging in as demo user
    const response = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      alert(response.statusText);
    }

    await submitLoginForm(email, password);
  }
};

resetDemoData = async (e) => {
  // Logout first before logging in as demo user
  const response = await fetch('/api/users/resetdemo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    alert('Demo data has been reset');
    document.location.replace('/dashboard');
  } else {
    alert(await response.json().message);
  }
};

if (document.querySelector('#pick_demo_user_dropdown')) {
  document
    .querySelector('#pick_demo_user_dropdown')
    .addEventListener('change', switchDemoUser);
}

if (document.querySelector('#reset_demo_link')) {
  document
    .querySelector('#reset_demo_link')
    .addEventListener('click', resetDemoData);
}
