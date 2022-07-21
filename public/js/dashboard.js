const gotoGettingStarted = () => {
  document.location.replace('/api/services/getting-started');
};

const gotoPublishSkill = (e) => {
  document.location.replace('/api/services/getting-started');
};

if (document.querySelector('#continue_getting_started_btn')) {
  document
    .querySelector('#continue_getting_started_btn')
    .addEventListener('click', gotoGettingStarted);
}

if (document.querySelector('#update_existing_skill_btn')) {
  document
    .querySelector('#update_existing_skill_btn')
    .addEventListener('click', gotoPublishSkill);
}

updateServiceRequest = async () => {
  const id = document
    .querySelector('#close_service_request_btn')
    .getAttribute('data-id');

  const status = document
    .querySelector('#close_service_request_btn')
    .getAttribute('data-status');

  if (id) {
    const response = await fetch('/api/services/' + id, {
      method: 'PUT',
      body: JSON.stringify({
        id,
        status,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      gotoDashboard();
    } else {
      alert(await response.json().message);
    }
  }
};

if (document.querySelector('#close_service_request_btn')) {
  document
    .querySelector('#close_service_request_btn')
    .addEventListener('click', updateServiceRequest);
}
