const rates = (() => {
  const ratesTable = document.getElementById("rates-table");

  const spinner = document.querySelector(".spinner");
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
    const tbody = document.createElement("tbody");

    data.forEach((rowData) => {
      let row = buildRow(rowData);

      tbody.appendChild(row);
    });

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
    const { dateStart, dateFinish, currency } = options;

    toggleSpinner();

    const currencies = JSON.parse(currency);
    const currencyIds = currencies.map((currency) => currency.id);
    const requests = currencyIds.map((id) =>
      buildRequestLink(id, dateStart, dateFinish)
    );

    const dates = getDates(new Date(dateStart), new Date(dateFinish));
    const currData = await fetchSimultaneously(requests);
    const normalizedData = normalizeData(dates, currData);

    const headData = ["Date", ...currencies.map((c) => c.quot)];
    buildTable(headData, normalizedData);
    toggleSpinner();
  }

  /*
    keys=[a,b,c]
    [
      [{key:a,val:1}, {key:b,val:2}],
      [{key:a,val:3}, {key:b,val:4}],
    ]

    result=[
      [a, 1, 3],
      [b, 2, 4]
    ]
  */
  function normalizeData(dates, data) {
    return dates.map((date) => [
      date,

      ...data.map((currArr) => {
        let curr = currArr.find((curr) => curr.Date.substr(0, 10) == date);

        return curr ? curr.Cur_OfficialRate : "N/A";
      }),
    ]);
  }

  function getDates(startDate, stopDate) {
    startDate = new Date(startDate);
    stopDate = new Date(stopDate);
    const dateArray = new Array();
    const currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate).toISOString().substr(0, 10));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  }

  return { fetchAndBuild };
})();
