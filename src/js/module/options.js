const options = (() => {
  const EARLIEST_DATE = "1991-01-01"
  const dateStart = document.getElementById("date-start");
  const dateFinish = document.getElementById("date-finish");
  const currencyInput = document.getElementById("currency-input");

  function buildCurrencyWhiteList() {
    return data.currencies.map((currency) => ({
      value: currency.Cur_Abbreviation,
      searchBy: [currency.Cur_Name, currency.Cur_Name_Eng].join(","),
      id: currency.Cur_ID,
      quot: `${currency.Cur_Scale} ${currency.Cur_Abbreviation}`,
    }));
  }

  function setInitialDateValue() {
    let today = new Date().toISOString().substr(0, 10);

    dateStart.value = dateFinish.value = today;
    dateStart.max = dateFinish.max = today;
    dateStart.min = dateFinish.min = EARLIEST_DATE;

  }

  function attachTagify() {
    const tagify = new Tagify(currencyInput, {
      enforceWhitelist: true,
      whitelist: buildCurrencyWhiteList(),
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
