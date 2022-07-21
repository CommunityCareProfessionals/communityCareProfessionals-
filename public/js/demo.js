switchDemoUser = async (e) => {
  const selectList = e.target.selectedOptions;

  if (selectList) {
    const email = selectList[0].getAttribute('data-email').trim();
    const password = selectList[0].getAttribute('data-password').trim();

    // Logout first before login in as demo user
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

if (document.querySelector('#pick_demo_user_dropdown')) {
  document
    .querySelector('#pick_demo_user_dropdown')
    .addEventListener('change', switchDemoUser);
}
