const result = (() => {
  const resultContainer = document.querySelector(".result");

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

  async function fetchData(options) {
    if (options.currency.length < 1) return;

    const { dateStart, dateFinish } = options;

    const currencies = JSON.parse(options.currency);
    const currencyIds = currencies.map((currency) => currency.id);
    
    const requests = currencyIds.map((id) =>
      buildRequestLink(id, dateStart, dateFinish)
    );

    const data = await fetchSimultaneously(requests);
  }

  return { fetchData };
})();
