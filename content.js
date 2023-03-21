(() => {
  const waitForElement = (selector, callback) => {
    const element = document.querySelector(selector);
    if (element) {
      console.debug('DOM element found:', element);
      callback(element);
    } else {
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          console.debug('DOM element found by MutationObserver:', element);
          observer.disconnect();
          callback(element);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  const fillField = (selector, value) => {
    waitForElement(selector, (element) => {
      console.debug(`Filling field (${selector}) with value:`, value);
      element.focus()
      element.value = "";
      element.innerText = "";
      element.placeholder = "";
      element.value = value;
      element.innerText = value;
      element.placeholder = value;
    });
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { taskTitle, description, acceptanceCriteria, workItemType } = message;
    console.debug('Received message:', message, " for workItemType: ", workItemType);

    if (workItemType == 'https://ablcode.visualstudio.com/Mojito/_workitems/create/Bug'){
      fillField('[aria-label="Title field"]', taskTitle);
      fillField('[aria-label="Repro Steps"]', description);
      fillField('[aria-label="Acceptance Criteria"]', acceptanceCriteria);
      console.log("inserting into RS");
    } else {
      fillField('[aria-label="Title field"]', taskTitle);
      fillField('[aria-label="Description"]', description);
      fillField('[aria-label="Acceptance Criteria"]', acceptanceCriteria);
      console.log("inserting into Description");
    }
    
  });
})();
