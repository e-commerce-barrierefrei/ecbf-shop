
class ComboboxSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]');
    this.listbox = this.querySelector('#ecbf-combobox-listbox');
    this.listboxOptionContainer = this.querySelector('#ecbf-combobox-listbox ul');
    this.liveregion = this.querySelector('#ecbf-combobox-search-status');
    this.allPredictiveSearchInstances = document.querySelectorAll('ecbf-combobox-search');
    this.resetButton = this.querySelector('button[type="reset"]');
    this.filteredOptions = [];

    this.searchTerm = '';

    if (this.input) {
      //this.input.form.addEventListener('reset', this.onFormReset.bind(this));
      this.input.addEventListener(
        'input',
        this.debounce((event) => {
          this.onChange(event);
        }, 300).bind(this)
      );
    }

    // this.predictiveSearchResults = this.listbox ??

    this.allOptions = [];
    this.cachedResults = {};
    this.isOpen = false;
    this.getAndHandleAllOptions();
    this.setupEventListeners();

  }

  getAndHandleAllOptions() {
    var nodes = this.listbox.querySelectorAll('li');

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      this.allOptions.push(node);

      node.addEventListener('click', this.onOptionClick.bind(this));
      // node.addEventListener('pointerover', this.onOptionPointerover.bind(this));
      // node.addEventListener('pointerout', this.onOptionPointerout.bind(this));
    }
  }

  onOptionClick(e) {
    console.log(e.target);
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
    this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));
    this.input.addEventListener('focus', this.onFocus.bind(this));
    this.input.addEventListener('input', this.onInput.bind(this));
    this.input.addEventListener('focusout', this.onFocusOut.bind(this));
    this.addEventListener('keyup', this.onKeyup.bind(this));
    this.addEventListener('keydown', this.onKeydown.bind(this));
  }

  onChange() {

    this.toggleResetButton();

    const newSearchTerm = this.getQuery();

    if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
      // Remove the results when they are no longer relevant for the new search term
      // so they don't show up when the dropdown opens again

      //this.querySelector('#ecbf-combobox-search-results-groups-wrapper ul')?.empty();
    }

    // Update the term asap, don't wait for the predictive search query to finish loading
    this.updateSearchForTerm(this.searchTerm, newSearchTerm);

    this.searchTerm = newSearchTerm;

    if (!this.searchTerm.length) {
      this.close(true);
      return;
    }

    //console.log("firing getSeachResults");
    this.listboxOptionContainer.innerHTML = '';
    this.getSearchResults(this.searchTerm);
  }

  updateSearchForTerm(previousTerm, newTerm) {
    const searchForTextElement = this.querySelector('[data-ecbf-combobox-search-search-for-text]');
    const currentButtonText = searchForTextElement?.innerText;
    if (currentButtonText) {
      if (currentButtonText.match(new RegExp(previousTerm, 'g')).length > 1) {
        // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
        return;
      }
      const newButtonText = currentButtonText.replace(previousTerm, newTerm);
      searchForTextElement.innerText = newButtonText;
    }
  }

  getLowercaseContentWithoutPrice(node) {
   if (node.querySelector('a') !== null ) {
      return node.querySelector('a').textContent.toLowerCase();
   } else {
     return node.textContent.toLowerCase();
   }
  }

  getSearchResults(searchTerm) {

    this.setLiveRegionLoadingState();

    // Der Kern der Suchfunktion ist bewusst eher simpel gehalten, weil vermutlich ohnehin
    // eigene Logik mit Apache Solr usw.

    this.allOptions.forEach((o) => {
      let option = o;
        if (
          searchTerm.length === 0 ||
          this.getLowercaseContentWithoutPrice(option).includes(searchTerm) === true
        ) {
          this.filteredOptions.push(option);
          this.listboxOptionContainer.appendChild(option);
        }
    });

    this.open();
  }

  // renderSearchResults(resultsMarkup) {
  //   this.setLiveRegionResults();
  //   this.open();
  // }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.querySelector('[data-ecbf-combobox-search-live-region-count-value]').textContent);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
    }, 1000);
  }

  onInput() {
    this.open();
  }

  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector('.ecbf-combobox-search-status');
    this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

    this.setLiveRegionText(this.loadingText);
    this.setAttribute('loading', true);
  }

  toggleResetButton() {
    // const resetIsHidden = this.resetButton.classList.contains('hidden');
    // if (this.input.value.length > 0 && resetIsHidden) {
    //   this.resetButton.classList.remove('hidden');
    // } else if (this.input.value.length === 0 && !resetIsHidden) {
    //   this.resetButton.classList.add('hidden');
    // }
  }

  open() {
    this.input.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.input.setAttribute('aria-expanded', 'false');
  }

  onKeyup() {
    if (!this.getQuery().length) this.close(true);
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        this.switchOption('up');
        break;
      case 'ArrowDown':
        this.switchOption('down');
        break;
      case 'Enter':
        this.selectOption();
        break;
      case 'Escape':
        this.close();
        break;
    }
  }

  selectOption() {
    const selectedOption = this.querySelector('[aria-selected="true"] a, button[aria-selected="true"]');

    if (selectedOption) console.log("sO", selectedOption); //selectedOption.click();
  }
  switchOption(direction) {

    console.log(direction);

    //if (!this.getAttribute('open')) return;

    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');

    // Filter out hidden elements (duplicated page and article resources) thanks
    // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    const allVisibleElements = Array.from(this.querySelectorAll('[role="option"]')).filter(
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

    this.statusElement.textContent = '';

    if (!moveUp && selectedElement) {
      activeElementIndex = selectedElementIndex === allVisibleElements.length - 1 ? 0 : selectedElementIndex + 1;
    } else if (moveUp) {
      activeElementIndex = selectedElementIndex === 0 ? allVisibleElements.length - 1 : selectedElementIndex - 1;
    }

    if (activeElementIndex === selectedElementIndex) return;

    const activeElement = allVisibleElements[activeElementIndex];

    activeElement.setAttribute('aria-selected', true);
    if (selectedElement) selectedElement.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', activeElement.id);

    console.log(activeElement.id)
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

  }
}
customElements.define('ecbf-combobox-search', ComboboxSearch);

