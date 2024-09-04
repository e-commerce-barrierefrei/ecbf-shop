import "tinysort";

export function sorting() {
  let sortOption = document.querySelector("#sort"),
      filterLiveRegion = document.querySelector("#filter-live-region"),
      data,
      order;

  sortOption.addEventListener('change', (e) => {
    switch (e.target.value) {
      case "name-desc":
        data = 'name';
        order = 'desc';
        filterLiveRegion.textContent = "Sortiert nach Alphabet, absteigend";
        break;
      case "name-asc":
        data = 'name';
        order = 'asc';
        filterLiveRegion.textContent = "Sortiert nach Alphabet, aufsteigend";
        break;
      case "price-desc":
        data = 'price';
        order = 'desc';
        filterLiveRegion.textContent = "Sortiert nach Preis, absteigend";
        break;
      case "price-asc":
        data = 'price';
        order = 'asc';
        filterLiveRegion.textContent = "Sortiert nach Preis, aufsteigend";
        break;
      default:
        filterLiveRegion.textContent = "Keine gesonderte Sortierung";
        break;
    }

    tinysort("#produktliste li",{ data, order});

  });

}
