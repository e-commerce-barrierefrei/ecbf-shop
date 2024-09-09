import products from '../../data.json';
const cartModal = document.querySelector("#cart-modal");

export function cart() {
  PetiteVue.createApp({
    products,
    filterLiveRegion: document.querySelector("#filter-live-region"),
    table: document.querySelector("[data-cart]"),
    cartCaptionTotal: document.querySelector("[data-cart-caption-total]"),
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    amount: 1,
    invoiceDataHidden: false,
    sum: 0,
    totalCartItems: 0,
    sortBy: "id",
    sortDirection: "asc",
    giftwrapPrice: 299,
    get sortedProducts() {
      return this.products.sort((p1, p2) => {
        let modifier = 1;
        if (this.sortDirection === "desc") modifier = -1;
        if (p1[this.sortBy] < p2[this.sortBy]) return -1 * modifier;
        if (p1[this.sortBy] > p2[this.sortBy]) return 1 * modifier;
        return 0;
      });
    },
    updateItemPrice(id) {
      let product = this.getCartItemById(id)[0];
      product.amount = parseFloat(event.target.value);
      this.persistCart();
      this.getLocalSum(product, parseFloat(event.target.value));
      this.getLocalTotal(product);
      this.updateCartItemAmount();
      this.updateTotalSum();
      this.filterLiveRegion.textContent = "Neuer Preis: €" + this.getLocalTotal(product) / 100 + ". Neuer Gesamtpreis des Warenkorbs: € " + this.sum/100;
      this.cartCaptionTotal.textContent = String(this.sum/100);
    },
    whenMounted() {
      this.updateCartItemAmount();
      this.updateTotalSum();

      setTimeout(() => {
        this.cartCaptionTotal.textContent = String(this.sum/100);
      }, 500);

    },
    updateCartItemAmount() {
      let cartItemAmount = 0;

      this.cart.forEach((cI) => {
        cartItemAmount += cI.amount;
      });

      this.totalCartItems = cartItemAmount;
    },
    updateTotalSum() {

      let theSum = 0;

      this.cart.forEach((product) => {
        theSum += product.price * product.amount;

        if (product.giftwrap) {
          theSum = theSum + this.giftwrapPrice;
        }
      })

      this.sum = theSum;
    },
    getLocalSum(cartItem, amount) {
      if (cartItem && amount) {
        let returnVal = cartItem.price * amount;
        cartItem.localTotal = returnVal;
        return returnVal;
      }
    },
    getLocalTotal(product) {
      let price;
      price = product.localTotal;

      if (product.giftwrap) {
        price += this.giftwrapPrice;
      }

      return price;
    },
    localSum(cartItem, amount) {
      return this.getLocalSum(cartItem, amount);
    },
    isInCart(id) {
      return this.cart.find(x => x.id === id);
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
    getProductById(id) {
      return products.filter((product) => product.id === id);
    },
    getCartItemById(id) {
      return this.cart.filter((product) => product.id === id);
    },
    persistCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    },
    toggleCartItem(productId) {
      let product = this.getProductById(productId);
      // Wenn bereits im Warenkorb, entferne den Artikel, aktualisiere die Summe, gib eine entsprechende Meldung in der Live Region aus und persistiere den neuen Warenkorb in Local Storage
      if (this.cart.find(x => x.id === productId)) {
        this.cart = this.cart.filter((n) => n.id !== product[0].id);
        this.persistCart();
        this.updateTotalSum();
        this.filterLiveRegion.textContent = "Artikel " + product[0].name + " entfernt. Neuer Gesamtpreis des Warenkorbs: € " + this.sum/100;
        setTimeout(() => {
          this.cartCaptionTotal.textContent = String(this.sum/100);
        }, 100);
        // Fokussiere die Warenkorbtabelle, sodass ihr zugänglicher Name in Form einer aktualisierten <caption> ausgegeben wird
        this.$refs.cart.focus();
      }
      else {
        // Wenn nicht im Warenkorb, ergänze, aktualisiere die Summe, gib eine entsprechende Meldung in der Live Region aus und persistiere den neuen Warenkorb in Local Storage
        product[0].localTotal = product[0].price;
        this.cart.push(product[0]);
        this.updateTotalSum();
        this.filterLiveRegion.textContent = "Artikel "+ product[0].name + " ergänzt. Neuer Gesamtpreis des Warenkorbs: € " + this.sum/100;
        this.persistCart();
        cartModal.showModal();
      }
      this.getLocalTotal(product);
      this.updateCartItemAmount();
      setTimeout(() => {
        this.cartCaptionTotal.textContent = String(this.sum/100);
      }, 100);
    },
    toggleGiftWrap(id) {
      let item = this.getCartItemById(id)[0];
      item.giftwrap = !item.giftwrap;
      this.persistCart();
      this.updateTotalSum();
      let addedOrRemoved =  (item.giftwrap) ? 'hinzugefügt' : 'entfernt';

      this.filterLiveRegion.textContent = "Geschenkverpackung " + addedOrRemoved + ". Neuer Preis: €" + this.getLocalTotal(item) / 100 + ". Neuer Gesamtpreis des Warenkorbs: € " + this.sum/100;
    },
    hasGiftwrap(id) {
      if (this.getCartItemById(id)[0]) return this.getCartItemById(id)[0].giftwrap;
    },
    sort: function (s) {
      if (s === this.sortBy) {
        this.sortDirection = this.sortDirection === "asc" ? "asc" : "desc";
      }
      this.sortBy = s;
    }
  }).mount();
}

const cartDialog = document.querySelector('#cart-modal');
cartDialog.addEventListener('click', (event) => {
  if (event.target.nodeName === 'DIALOG') {
    cartDialog.close();
  }
});
