const options = (() => {
  const dateStart = document.getElementById("date-start");
  const dateFinish = document.getElementById("date-finish");
  const currencyInput = document.getElementById("currency-input");

  function setInitialDateValue() {
    let today = new Date().toISOString().substr(0, 10);

    dateStart.value = dateFinish.value = today;
  }

  function attachTagify() {
    const tagify = new Tagify(currencyInput, {
      enforceWhitelist: true,
      whitelist: [
        {
          value: "USD",
          searchBy: "United States Dollar",
          id: 145,
        },
        { value: "RUB", searchBy: "Russin Rouble", id: 298 },
        { value: "MDL", searchBy: "Moldovan Leu", id: 296 },
      ],
    });
  }

  function getOptions() {
    return {
      dateStart: dateStart.value,
      dateFinish: dateFinish.value,
      currency: currencyInput.value,
    };
  }

  function init() {
    setInitialDateValue();
    attachTagify();
  }
  return { init, getOptions };
})();
