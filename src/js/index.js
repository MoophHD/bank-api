(() => {
  options.init();

  const btn = document.getElementById("fetch");
  btn.addEventListener("click", () => {
    rates.fetchAndBuild(options.getOptions());
  });
})();
