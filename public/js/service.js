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

displaySkillsHandler = (radioBtn) => {
  let level = '';

  if (radioBtn.hasAttribute('data-level')) {
    level = radioBtn.getAttribute('data-level');
  }

  document
    .querySelector('#selectedSkill')
    .setAttribute('data-category_name', radioBtn.getAttribute('data-name'));

  document.querySelectorAll('fieldset[data-level]').forEach((field) => {
    field.style.display = 'none';
  });

  document.querySelector(
    '#category_skills_' + level + radioBtn.id
  ).style.display = 'flex';
  document.querySelector(
    '#category_skills_' + level + radioBtn.id
  ).style.flexWrap = 'wrap';
};

handleSkillSelection = (radioBtn) => {
  document.querySelector('#selectedSkill').textContent =
    radioBtn.getAttribute('data-name');
  document
    .querySelector('#selectedSkill')
    .setAttribute('data-category_skill_id', radioBtn.getAttribute('data-id'));
  document
    .querySelector('#selectedSkill')
    .setAttribute('data-skill_name', radioBtn.getAttribute('data-name'));

  if (document.querySelector('#selectedSkill').textContent) {
    document.querySelector('#selectedSkillWrapper').style.display = 'block';
  } else {
    document.querySelector('#selectedSkillWrapper').style.display = 'none';
  }
};

submitServiceRequest = async () => {
  const category_skill_id = document
    .querySelector('#selectedSkill')
    .getAttribute('data-category_skill_id');
  const category_name = document
    .querySelector('#selectedSkill')
    .getAttribute('data-category_name');
  const skill_name = document
    .querySelector('#selectedSkill')
    .getAttribute('data-skill_name');

  const description = document.querySelector('#new_service_title').value;

  if (category_skill_id && category_name && skill_name && description) {
    const response = await fetch(`/api/services/new`, {
      method: 'POST',
      body: JSON.stringify({
        category_skill_id,
        description,
        name: category_name + '_' + skill_name + '_' + datetimestamp(),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      gotoDashboard();
    } else {
      alert('Failed to create service request');
    }
  }
};

const gotoTitle = (e) => {
  document.location.replace('/api/services/title');
};

const gotoGettingStarted = (e) => {
  document.location.replace('/api/services/getting-started');
};

const gotoDashboard = (e) => {
  document.location.replace('/dashboard');
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

if (document.querySelector('#continue_title_btn')) {
  document
    .querySelector('#continue_title_btn')
    .addEventListener('click', submitServiceRequest);
}

function datetimestamp() {
  var today = new Date();
  var sToday = (today.getMonth() + 1).toString();
  sToday += today.getDate().toString();
  sToday += today.getYear().toString();
  sToday += today.getHours().toString();
  sToday += today.getMinutes().toString();
  sToday += today.getSeconds().toString();
  return sToday;
}
