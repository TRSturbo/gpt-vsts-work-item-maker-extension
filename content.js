(() => {
  const waitForElement = (selector, callback) => {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          callback(element);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  const fillField = (selector, value) => {
    waitForElement(selector, (element) => {
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
    let { taskTitle, description, acceptanceCriteria, workItemType } = message;

    //title selector is different between current and preview, 
    //so we use the placeholder (that is the same) and update it when loaded for now as a workaround
    let taskElementSelector = '[placeholder="Enter title"]';
    if (taskTitle != "Loading Title..."){
      taskElementSelector = '[placeholder="Loading Title..."]'
    }

    //If it's a Bug, we need to target 'Repro Steps' input instead of 'Description'
    if (workItemType.includes("create/Bug")){
      fillField(taskElementSelector, taskTitle);
      fillField('[aria-label="Repro Steps"]', description);
      fillField('[aria-label="Acceptance Criteria"]', acceptanceCriteria);
      fillField('[aria-label="Effort"]', 0);
    } else {
      fillField(taskElementSelector, taskTitle);
      fillField('[aria-label="Description"]', description);
      fillField('[aria-label="Acceptance Criteria"]', acceptanceCriteria)
    }
    
  });
})();
