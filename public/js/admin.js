var gotoDashboard = (e) => {
  document.location.replace('/dashboard');
};

switchDemoMode = async (box) => {
  const demo_mode = document.querySelector('#demo_mode');

  if (demo_mode) {
    const response = await fetch('/demo', {
      method: 'PUT',
      body: JSON.stringify({
        isDemo: demo_mode.checked,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      gotoDashboard();
    } else {
      const data = await response.json();
      alert(data.message);
    }
  }
};
