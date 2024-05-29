class ComboboxSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.listbox = this.querySelector("#ecbf-combobox-listbox");
    this.listboxOptionContainerProducts = this.querySelector("[data-products-list]");
    this.listboxOptionContainerPages = this.querySelector("[data-pages-list]");
    this.statusElement = this.querySelector("[data-ecbf-combobox-search-status]");
    this.filteredOptions = [];
    this.searchTerm = "";
    this.allProductOptions = [];
    this.allPageOptions = [];
    this.startsOpen = this.getAttribute('starts-open');

    if (this.input) {
      this.input.addEventListener("input", this.debounce((event) => {
          this.onChange(event);
        }, 200).bind(this)
      );
    }

    if (this.startsOpen === "true") {
      this.input.setAttribute("aria-expanded", "true");
    };

    this.getAndHandleAllOptions();
    this.setupEventListeners();
  }

  getAndHandleAllOptions() {
    this.listbox.querySelectorAll("[data-products-list] li").forEach((product) => this.allProductOptions.push(product));
    this.listbox.querySelectorAll("[data-pages-list] li").forEach((page) => this.allPageOptions.push(page));
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  getQuery() {
    return this.input.value.trim();
  }

  setupEventListeners() {
    this.input.form.addEventListener("submit", this.onFormSubmit.bind(this));
    this.input.addEventListener("focusout", this.onFocusOut.bind(this));
    this.input.addEventListener("input", this.onInput.bind(this));
    this.addEventListener("keyup", this.onKeyup.bind(this));
  }

  onChange() {

    const newSearchTerm = this.getQuery();

    this.updateSearchForTerm(newSearchTerm);

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }

    this.listboxOptionContainerProducts.innerHTML = "";
    this.listboxOptionContainerPages.innerHTML = "";
    this.getSearchResults(this.searchTerm);
  }

  updateSearchForTerm(newTerm) {
    const searchForTextElement = this.querySelector("[data-ecbf-combobox-search-search-for-text]");
    searchForTextElement.innerText = newTerm;
  }

  getLowercaseContentWithoutPrice(node) {
    if (node.querySelector("a") !== null) {
      return node.querySelector("a").textContent.toLowerCase();
    } else {
      return node.textContent.toLowerCase();
    }
  }

  getSearchResults(searchTerm) {

      this.allProductOptions.forEach((o) => {
        let option = o;
        if (
          searchTerm.length === 0 ||
          this.getLowercaseContentWithoutPrice(option).includes(searchTerm) === true
        ) {
          this.filteredOptions.push(option);
          this.listboxOptionContainerProducts.appendChild(option);
        }
      });



    this.allPageOptions.forEach((o) => {
      let option = o;
      if (
        searchTerm.length === 0 ||
        this.getLowercaseContentWithoutPrice(option).includes(searchTerm) === true
      ) {
        this.filteredOptions.push(option);
        this.listboxOptionContainerPages.appendChild(option);
      }
    });

    const realTimeOptionAmount1 = this.listboxOptionContainerProducts.querySelectorAll("[data-products-list] li")?.length;
    const realTimeOptionAmount2 = this.listboxOptionContainerPages.querySelectorAll("[data-pages-list] li")?.length;

      if (realTimeOptionAmount1 || realTimeOptionAmount2) {
        if (this.input.value !== "") {
          setTimeout(() => {
            this.setLiveRegionText(`${realTimeOptionAmount1 + realTimeOptionAmount2} Ergebnisse gefunden: ${realTimeOptionAmount1 ? realTimeOptionAmount1 : 0} Produkte und ${realTimeOptionAmount2 ? realTimeOptionAmount2 : 0} Seiten`);
          }, 1100);
        } else {
          this.yieldNoResultsInLiveRegion();
        }
      } else {
        this.yieldNoResultsInLiveRegion();
      }

    this.open();

  }

  yieldNoResultsInLiveRegion() {
    this.setLiveRegionText("Keine Ergebnisse geunden. Bitte versuchen Sie es mit einem anderen Suchbegriff.");
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute("aria-hidden", "false");
    this.statusElement.textContent = statusText;

    console.log("live region", statusText);

    setTimeout(() => {
      this.statusElement.setAttribute("aria-hidden", "true");
    }, 1000);
  }

  onInput() {
    this.open();
  }

  open() {
    if (this.getQuery().length >= 2) {
      setTimeout(() => this.input.setAttribute("aria-expanded", "true"), 500)
    }
  }

  close() {
    this.input.setAttribute("aria-expanded", "false");
  }

  onKeyup() {
    if (!this.getQuery().length) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case "ArrowUp":
        this.switchOption("up");
        break;
      case "ArrowDown":
        this.switchOption("down");
        break;
      case "Enter":
        this.selectOption();
        break;
      case "Escape":
        this.close();
        this.input.select();
        break;
      default:
        this.emptyAriaActivedescendant();
    }
  }

  emptyAriaActivedescendant() {
    this.input.setAttribute('aria-activedescendant', '');
  }

  selectOption() {
    const selectedOption = this.querySelector("[aria-selected=\"true\"] a, button[aria-selected=\"true\"]");

    if (selectedOption) {
      selectedOption.click();
    }
  }

  switchOption(direction) {

    if (this.getQuery() === "") return;

    const moveUp = direction === "up";
    const selectedElement = this.querySelector("[aria-selected=\"true\"]");

    // offsetParnet filtert unsichtbare Elemente heraus:
    const allVisibleElements = Array.from(this.querySelectorAll('[role="option"]')).filter(
      (el) => el.offsetParent !== null
    );

    let activeElementIndex = 0;

    if (moveUp && !selectedElement) return;

    let selectedElementIndex = -1;
    let i = 0;

    while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
      if (allVisibleElements[i] === selectedElement) {
        selectedElementIndex = i;
      }
      i++;
    }

    this.statusElement.textContent = "";

    if (!moveUp && selectedElement) {
      activeElementIndex = selectedElementIndex === allVisibleElements.length - 1 ? 0 : selectedElementIndex + 1;
    } else if (moveUp) {
      activeElementIndex = selectedElementIndex === 0 ? allVisibleElements.length - 1 : selectedElementIndex - 1;
    }

    if (activeElementIndex === selectedElementIndex) return;

    const activeElement = allVisibleElements[activeElementIndex];

    activeElement.setAttribute("aria-selected", true);
    if (selectedElement) selectedElement.setAttribute("aria-selected", false);

    this.input.setAttribute("aria-activedescendant", activeElement.id);
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onFormSubmit() {
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
  }
}

customElements.define("ecbf-combobox-search", ComboboxSearch);

