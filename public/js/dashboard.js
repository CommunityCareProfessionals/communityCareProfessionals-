const gotoGettingStarted = () => {
  document.location.replace('/api/services/getting-started');
};

const gotoPublishSkill = (e) => {
  document.location.replace('/api/services/getting-started');
};

const goEditPost = (e) => {
  document.location.replace('/api/services/getting-started');
};

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
      document.location.replace('/dashboard');
    } else {
      alert(await response.json().message);
    }
  }
};

if (document.querySelector('#editBtn')) {
  document.querySelector('#editBtn').addEventListener('click', goEditPost);
}

if (document.querySelector('#new-post-cons')) {
  document.querySelector('#new-post-cons').addEventListener(gotoGettingStarted);
}

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

if (document.querySelector('#close_service_request_btn')) {
  document
    .querySelectorAll('#close_service_request_btn')
    .forEach((btn) => btn.addEventListener('click', updateServiceRequest));
}
