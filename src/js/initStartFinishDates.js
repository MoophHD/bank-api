(() => {
  const dateStart = document.getElementById('date-start');
  const dateFinish = document.getElementById('date-finish');

  let today = new Date().toISOString().substr(0, 10);

  dateStart.value = dateFinish.value = today;
})();
