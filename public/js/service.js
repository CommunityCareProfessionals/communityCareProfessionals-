const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#project-name').value.trim();
  const needed_funding = document
    .querySelector('#project-funding')
    .value.trim();
  const description = document.querySelector('#project-desc').value.trim();

  if (name && needed_funding && description) {
    const response = await fetch(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify({ name, needed_funding, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};

const newOrExistingServiceHandler = (event) => {
  var existing_services_radio = document.querySelector(
    '#existing_service_radio'
  );

  if (existing_services_radio.checked) {
    document.querySelector('#existing-services').style.display = 'block';
  } else {
    document.querySelector('#existing-services').style.display = 'none';
  }
};

const gettingStartedContinueHandler = async (e) => {
  if (document.querySelector('#new_service_radio').checked) {
    document.location.replace('/api/services/title');
  } else {
    document.location.replace(
      '/api/services/' +
        document.querySelector('#existing-service-to-edit').value
    );
  }
};

const titleChangeHandler = async (event) => {
  var new_service_title_text = document.querySelector('#new_service_title');

  // after a word is entered, hide examples and show categories
  if (
    new_service_title_text.value &&
    new_service_title_text.value.indexOf(' ') >= 0
  ) {
    document.querySelector('#choose_category_fieldset').style.display = 'block';
    document.querySelector('#title_examples').style.display = 'none';
  } else {
    document.querySelector('#choose_category_fieldset').style.display = 'none';
    document.querySelector('#title_examples').style.display = 'block';
  }
};

const gotoTitle = (e) => {
  document.location.replace('/api/services/title');
};

const gotoGettingStarted = (e) => {
  document.location.replace('/api/services/getting-started');
};

const gotoDashboard = (e) => {
  document.location.replace('/api/dashboard');
};

if (document.querySelector('#existing_service_radio')) {
  document
    .querySelector('#existing_service_radio')
    .addEventListener('change', newOrExistingServiceHandler);
}

if (document.querySelector('#new_service_radio')) {
  document
    .querySelector('#new_service_radio')
    .addEventListener('change', newOrExistingServiceHandler);
}

if (document.querySelector('#continue_getting_started_btn')) {
  document
    .querySelector('#continue_getting_started_btn')
    .addEventListener('click', gettingStartedContinueHandler);
}

if (document.querySelector('#cancel_getting_started_btn')) {
  document
    .querySelector('#cancel_getting_started_btn')
    .addEventListener('click', gotoDashboard);
}

if (document.querySelector('#back_title_btn')) {
  document
    .querySelector('#back_title_btn')
    .addEventListener('click', gotoGettingStarted);
}

if (document.querySelector('#new_service_title')) {
  document
    .querySelector('#new_service_title')
    .addEventListener('keypress', titleChangeHandler);
}
