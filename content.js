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

  const fillField = (selector, desiredValue) => {
    waitForElement(selector, (element) => {
      element.focus();
      element.value = desiredValue;
      element.innerText = desiredValue;
      element.placeholder = desiredValue;
    });
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let workItemTypeValue = message.workItemType;
    let fieldValue = message.field;
    let contentValue = message.content;

    //title selector is different between current and preview, 
    //so we use the placeholder (that is the same) and update it when loaded for now as a workaround
    let taskElementSelector = '[placeholder="Enter title"]';
    if (fieldValue == 'title' && contentValue != "Loading Title..."){
      taskElementSelector = '[placeholder="Loading Title..."]'
    }

    //If it's a Bug, we need to target 'Repro Steps' input instead of 'Description'
    if (workItemTypeValue.includes("create/Bug")){
      if (fieldValue == "title"){
        fillField(taskElementSelector, contentValue);
        fillField('[aria-labelledby="__bolt-Effort"]', 0);
      } else if (fieldValue == "description"){
        fillField('[aria-label="Repro Steps"]', contentValue);
      } else if (fieldValue == "ac"){
        fillField('[aria-label="Acceptance Criteria"]', contentValue);
      }
    } else {
      if (fieldValue == "title"){
        fillField(taskElementSelector, contentValue);
      } else if (fieldValue == "description"){
        fillField('[aria-label="Description"]', contentValue);
      } else if (fieldValue == "ac"){
        fillField('[aria-label="Acceptance Criteria"]', contentValue);
      }
    }
    
  });
})();
