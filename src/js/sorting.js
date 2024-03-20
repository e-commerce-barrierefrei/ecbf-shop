import "tinysort";

export function sorting() {
  let sortOption = document.querySelector("#sort"), 
      filterOption = document.querySelector("#few"),   
      filterLiveRegion = document.querySelector("#filter-live-region"),
      data, 
      order;

  filterOption.checked = false;

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

  filterOption.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.querySelectorAll("[data-amount]").forEach(element => {
        if (element.dataset.amount < 10) {
          element.hidden = true;
          filterLiveRegion.textContent = "Zeige nur Produkte mit geringer Stückzahl";

        }
      });
    } else {
      document.querySelectorAll("[data-amount]").forEach(element => {
      element.hidden = false;
      filterLiveRegion.textContent = "Zeige alle Produkte";
    });
    }
  });

  
}
