import products from '../../data.json';
const cartModal = document.querySelector("#cart-modal");

export function cart() {


  PetiteVue.createApp({
    products,
    filterLiveRegion: document.querySelector("#filter-live-region"),
    cart: [],
    sortBy: "id",
    sortDirection: "asc",
    filterOn: false,
    get sortedProducts() {
      return this.products.sort((p1, p2) => {
        let modifier = 1;
        if (this.sortDirection === "desc") modifier = -1;
        if (p1[this.sortBy] < p2[this.sortBy]) return -1 * modifier;
        if (p1[this.sortBy] > p2[this.sortBy]) return 1 * modifier;
        return 0;
      });
    },
    isFiltered(product) {
      return (this.filterOn && product.amount < 10);
    },
    isInCart(id) {
      return this.cart.includes(id);
    },
    changeSort(e) {
      switch (e.target.value) {
        case "name-desc":
          this.sortDirection = "desc";
          this.sort("name");
          this.filterLiveRegion.textContent = "Sortiert nach: Name, Z bis A";
          break;
        case "name-asc":
          this.sortDirection = "asc";
          this.sort("name");
          this.filterLiveRegion.textContent = "Sortiert nach: Name, A bis Z";
          break;
        case "price-asc":
          this.sortDirection = "asc";
          this.sort("price");
          this.filterLiveRegion.textContent =
            "Sortiert nach: Preis, günstigste zuerst";
          break;
        case "price-desc":
          this.sortDirection = "desc";
          this.sort("price");
          this.filterLiveRegion.textContent =
            "Sortiert nach: Preis, teuerste zuerst";
          break;
        case "":
          this.sortDirection = "asc";
          this.sort("id");
          this.filterLiveRegion.textContent = "Sortierung zurückgesetzt";
          break;
      }
    },
    getCartItemById(id) {
      return this.products.filter((n) => n.id === id);
    },
    toggleCartItem(id) {
      if (this.isInCart(id)) {
        this.cart = this.cart.filter((n) => n != id);
      } else {
        this.cart.push(id);
        cartModal.showModal();
      }
    },
    sort: function (s) {
      if (s === this.sortBy) {
        this.sortDirection = this.sortDirection === "asc" ? "asc" : "desc";
      }
      this.sortBy = s;
    },
  }).mount();
}
