const rates = (() => {
  const ratesTable = document.getElementById("rates-table");

  const spinner = document.querySelector('.spinner');
  const spinnerActiveClass = "spinner--active";

  function toggleSpinner() {
    spinner.classList.toggle(spinnerActiveClass);
  }

  function buildTable(headData, bodyData) {
    const table = ratesTable;
    table.innerHTML = "";

    const thead = buildHead(headData);
    const tbody = buildBody(bodyData);

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  function buildBody(data) {
    const cols = data.length;
    const rows = data[0].length;

    const tbody = document.createElement("tbody");
    const dates = data[0].map((dataRow) => dataRow.Date.substr(0, 10));
    for (let i = 0; i < rows; i++) {
      let date = dates[i];
      let rates = [];
      for (let j = 0; j < cols; j++) {
        let rate = data[j][i].Cur_OfficialRate;
        rates.push(rate);
      }

      let row = buildRow([date, ...rates]);

      tbody.appendChild(row);
    }

    return tbody;
  }

  function buildHead(data) {
    const thead = document.createElement("thead");
    const row = buildRow(data);

    thead.appendChild(row);

    return thead;
  }

  function buildRow(data) {
    const row = document.createElement("tr");

    for (let el of data) {
      let cell = buildCell(el);
      row.appendChild(cell);
    }

    return row;
  }

  function buildCell(key) {
    let th = document.createElement("td");
    let text = document.createTextNode(key);
    th.appendChild(text);

    return th;
  }

  async function fetchSimultaneously(urls) {
    const queue = urls;
    const maxSimultaneouslyRequests = 5;
    let currentRequests = 0;
    let i = 0;

    return await new Promise((resolve) => {
      const result = [];

      const fetcher = setInterval(async () => {
        if (queue.filter((url) => url).length === 0) {
          clearInterval(fetcher);
          resolve(result);
        }

        if (
          currentRequests >= maxSimultaneouslyRequests ||
          i > queue.length - 1
        ) {
          return;
        }

        const index = i++;
        const url = queue[index];

        currentRequests++;
        result[index] = await (await fetch(url)).json();
        currentRequests--;

        delete queue[index];
      }, 100);
    });
  }

  function buildRequestLink(id, dateStart, dateFinish) {
    return `https://www.nbrb.by/API/ExRates/Rates/Dynamics/${id}?startDate=${dateStart}&endDate=${dateFinish}`;
  }

  async function fetchAndBuild(options) {
    if (options.currency.length < 1) return;
    const { dateStart, dateFinish } = options;

    toggleSpinner();

    const currencies = JSON.parse(options.currency);
    const currencyIds = currencies.map((currency) => currency.id);

    const requests = currencyIds.map((id) =>
      buildRequestLink(id, dateStart, dateFinish)
    );

    const data = await fetchSimultaneously(requests);

    const headData = ["Дата", ...currencies.map((c) => c.quot)];
    buildTable(headData, data);
    toggleSpinner();
  }

  return { fetchAndBuild };
})();
