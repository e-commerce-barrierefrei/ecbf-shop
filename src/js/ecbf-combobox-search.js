class ComboboxSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input[type=\"search\"]");
    this.listbox = this.querySelector("#ecbf-combobox-listbox");
    this.listboxOptionContainer1 = this.querySelector("#ecbf-combobox-listbox ul#cb1-listbox");
    this.listboxOptionContainer2 = this.querySelector("#ecbf-combobox-listbox ul#cb2-listbox");
    this.liveregion = this.querySelector("#ecbf-combobox-search-status");
    this.allPredictiveSearchInstances = document.querySelectorAll("ecbf-combobox-search");
    this.statusElement = this.querySelector(".ecbf-combobox-search-status");
    this.filteredOptions = [];

    this.searchTerm = "";

    if (this.input) {
      this.input.addEventListener(
        "input",
        this.debounce((event) => {
          this.onChange(event);
        }, 200).bind(this)
      );
    }


    this.allOptions1 = [];
    this.allOptions2 = [];
    this.cachedResults = {};
    this.isOpen = false;
    this.getAndHandleAllOptions();
    this.setupEventListeners();
  }

  getAndHandleAllOptions() {
    var nodes1 = this.listbox.querySelectorAll("#cb1-listbox li");
    var nodes2 = this.listbox.querySelectorAll("#cb2-listbox li");

    for (var i = 0; i < nodes1.length; i++) {
      var node1 = nodes1[i];
      this.allOptions1.push(node1);

      node1.addEventListener("click", this.onOptionClick.bind(this));
    }

    for (var j = 0; j < nodes2.length; j++) {
      var node2 = nodes2[j];
      this.allOptions2.push(node2);

      node2.addEventListener("click", this.onOptionClick.bind(this));
    }
  }

  onOptionClick(e) {
    console.log("onOptionClick");
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

    this.input.addEventListener("focus", this.onFocus.bind(this));
    this.input.addEventListener("input", this.onInput.bind(this));
    this.input.addEventListener("focusout", this.onFocusOut.bind(this));
    this.addEventListener("keyup", this.onKeyup.bind(this));
    this.addEventListener("keydown", this.onKeydown.bind(this));
  }

  onChange() {

    const newSearchTerm = this.getQuery();

    this.updateSearchForTerm(newSearchTerm);

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }

    this.listboxOptionContainer1.innerHTML = "";
    this.listboxOptionContainer2.innerHTML = "";
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

      this.allOptions1.forEach((o) => {
        let option = o;
        if (
          searchTerm.length === 0 ||
          this.getLowercaseContentWithoutPrice(option).includes(searchTerm) === true
        ) {
          this.filteredOptions.push(option);
          this.listboxOptionContainer1.appendChild(option);
        }
      });

    this.allOptions2.forEach((o) => {
      let option = o;
      if (
        searchTerm.length === 0 ||
        this.getLowercaseContentWithoutPrice(option).includes(searchTerm) === true
      ) {
        this.filteredOptions.push(option);
        this.listboxOptionContainer2.appendChild(option);
      }
    });

    // const realTimeOptionAmount = this.listboxOptionContainer1.querySelectorAll("li")?.length;
    //
    //   if (realTimeOptionAmount) {
    //     if (this.input.value !== "") {
    //       setTimeout(() => {
    //         this.setLiveRegionText(`${realTimeOptionAmount} Ergebnisse gefunden`);
    //       }, 700);
    //     } else {
    //       this.yieldNoResultsInLiveRegion();
    //     }
    //   } else {
    //     this.yieldNoResultsInLiveRegion();
    //   }

      this.open();

  }

  yieldNoResultsInLiveRegion() {
    this.setLiveRegionText("Keine Ergebnisse geunden. Bitte versuchen Sie es mit einem anderen Suchbegriff.");
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute("aria-hidden", "false");
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute("aria-hidden", "true");
    }, 1000);
  }

  onInput() {
    if (this.getQuery().length >= 2) {
      this.open();
    }
  }

  open() {
    this.input.setAttribute("aria-expanded", "true");
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
        break;
    }
  }

  selectOption() {
    const selectedOption = this.querySelector("[aria-selected=\"true\"] a, button[aria-selected=\"true\"]");

    if (selectedOption) {
      alert(selectedOption);
      selectedOption.click();
    }
    //;
  }

  switchOption(direction) {

    const moveUp = direction === "up";
    const selectedElement = this.querySelector("[aria-selected=\"true\"]");

    // Filter out hidden elements (duplicated page and article resources) thanks
    // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    const allVisibleElements = Array.from(this.querySelectorAll("[role=\"option\"]")).filter(
      (element) => element.offsetParent !== null
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

  onKeydown() {

  }

  onFocus() {

  }

  onFocusOut() {
    //this.close();

    // setTimeout(() => {
    //   if (!this.contains(document.activeElement)) this.close();
    // });
  }

  onFormSubmit() {

    if (!this.getQuery().length || this.querySelector("[aria-selected=\"true\"] a")) event.preventDefault();

  }
}

customElements.define("ecbf-combobox-search", ComboboxSearch);

