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
  const isProvider = e.target.getAttribute('data-type') == 'provider';

  if (isProvider) {
    if (document.querySelector('#publish_skill_radio').checked) {
      gotoPublishSkill();
    } else if (document.querySelector('#match_service_radio').checked) {
      gotoMatchServiceRequest();
    }
  } else {
    if (document.querySelector('#new_service_radio').checked) {
      document.location.replace('/api/services/title');
    } else {
      document.location.replace(
        '/api/services/' +
          document.querySelector('#existing-service-to-edit').value
      );
    }
  }
};

const titleChangeHandler = (e) => {
  const isProvider = e.target.getAttribute('data-type');
  var new_service_title_text = document.querySelector('#new_service_title');

  // after a word is entered, hide examples and show categories
  if (isProvider) {
    if (
      new_service_title_text.value &&
      new_service_title_text.value.indexOf(' ') >= 0
    ) {
      document.querySelector('#choose_category_fieldset').style.display =
        'block';
    } else {
      document.querySelector('#choose_category_fieldset').style.display =
        'none';
    }
  } else {
    if (
      new_service_title_text.value &&
      new_service_title_text.value.indexOf(' ') >= 0
    ) {
      document.querySelector('#choose_category_fieldset').style.display =
        'block';
      document.querySelector('#title_examples').style.display = 'none';
    } else {
      document.querySelector('#choose_category_fieldset').style.display =
        'none';
      document.querySelector('#title_examples').style.display = 'block';
    }
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
  // enable Continue button
  document.querySelector('#continue_title_btn').disabled = false;

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

handleSkillSelection_provider = (checkBox) => {
  // enable Continue button
  document.querySelector('#continue_publish_skill_btn').disabled = false;

  document.querySelector('#selectedSkill').textContent =
    checkBox.getAttribute('data-name');
  document
    .querySelector('#selectedSkill')
    .setAttribute('data-category_skill_id', checkBox.getAttribute('data-id'));
  document
    .querySelector('#selectedSkill')
    .setAttribute('data-skill_name', checkBox.getAttribute('data-name'));

  if (document.querySelector('#selectedSkill').textContent) {
    document.querySelector('#selectedSkillWrapper').style.display = 'block';
  } else {
    document.querySelector('#selectedSkillWrapper').style.display = 'none';
  }
};

submitServiceRequest = async () => {
  const skillcategory_id = document
    .querySelector('#selectedSkill')
    .getAttribute('data-category_skill_id');
  const category_name = document
    .querySelector('#selectedSkill')
    .getAttribute('data-category_name');
  const skill_name = document
    .querySelector('#selectedSkill')
    .getAttribute('data-skill_name');

  const description = document.querySelector('#new_service_title').value;

  if (skillcategory_id && category_name && skill_name && description) {
    const response = await fetch(`/api/services/new`, {
      method: 'POST',
      body: JSON.stringify({
        skillcategory_id,
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

publishSkillHandler = async () => {
  const skillcategory_id = document
    .querySelector('#selectedSkill')
    .getAttribute('data-category_skill_id');
  const category_name = document
    .querySelector('#selectedSkill')
    .getAttribute('data-category_name');
  const skill_name = document
    .querySelector('#selectedSkill')
    .getAttribute('data-skill_name');

  if (skillcategory_id && category_name && skill_name) {
    const response = await fetch(`/api/services/publishskill`, {
      method: 'POST',
      body: JSON.stringify({
        skillcategory_id,
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

updateServiceRequest = async () => {
  const id = document
    .querySelector('#accept_service_request_btn')
    .getAttribute('data-id');

  const status = document
    .querySelector('#accept_service_request_btn')
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

updateServiceRequestConsumer = async () => {
  const id = document
    .querySelector('#continue_title_btn')
    .getAttribute('data-id');
  if (id) {
    const response = await fetch('/api/services/' + id, {
      method: 'PUT',
      body: JSON.stringify({
        id,
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

gotoPublishSkill = (e) => {
  document.location.replace('/api/services/publishskill');
};

gotoMatchServiceRequest = (e) => {
  document.location.replace('/api/services/match');
};

const enableGettingStartedContinueBtn = (btn) => {
  document.querySelector('#continue_getting_started_btn').disabled = false;
};

// const gotoTitle = (e) => {
//   document.location.replace('/api/services/title');
// };

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

// if (document.querySelector('#continue_getting_started_btn')) {
//   document
//     .querySelector('#continue_getting_started_btn')
//     .addEventListener('click', gotoTitle);
// }

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

if (document.querySelector('#continue_publish_skill_btn')) {
  document
    .querySelector('#continue_publish_skill_btn')
    .addEventListener('click', publishSkillHandler);
}

if (document.querySelector('#back_publish_skill_btn')) {
  document
    .querySelector('#back_publish_skill_btn')
    .addEventListener('click', gotoGettingStarted);
}

if (document.querySelector('#accept_service_request_btn')) {
  document
    .querySelectorAll('#accept_service_request_btn')
    .forEach((btn) => btn.addEventListener('click', updateServiceRequest));
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
