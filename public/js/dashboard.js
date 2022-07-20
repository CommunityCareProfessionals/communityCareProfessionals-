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

if (document.querySelector('#edit_service_commitment')) {
  document
    .querySelector('#edit_service_commitment')
    .addEventListener('click', editServiceCommitmentHandler);
}

if (document.querySelector('#update_existing_skill_btn')) {
  document
    .querySelector('#update_existing_skill_btn')
    .addEventListener('click', gotoPublishSkill);
}
