(() => {
  options.init();

  const btn = document.getElementById("fetch");
  btn.addEventListener("click", () => {
    result.fetchData(options.getOptions());
  });
})();
