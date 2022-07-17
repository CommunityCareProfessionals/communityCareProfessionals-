const gotoGettingStarted = (btn) => {
  document.location.replace('/api/services/getting-started');
};

if (document.querySelector('#continue_getting_started_btn')) {
  document
    .querySelector('#continue_getting_started_btn')
    .addEventListener('click', gotoGettingStarted);
}
