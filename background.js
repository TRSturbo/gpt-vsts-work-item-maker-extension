async function callGPTAPI(tabId, apiKey, prompt, workItemType) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a software development task creation assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2048,
      n: 1,
      temperature: 1,
    }),
  });

  const data = await response.json();

  if (response.status == 200 && data.choices && data.choices.length > 0) {
    return data.choices[0].message.content.trim();
  } else {
    runContentScript(tabId, "Error", "Error loading description from OpenAI API, please try again later. Error Code: " + response.status, "Error - " + data.error.message, workItemType);
  }

  throw new Error('GPT API response is not as expected');
}

async function runContentScript(tabId, taskTitle, description, acceptanceCriteria, workItemType) {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ['content.js'],
    },
    () => {
      chrome.tabs.sendMessage(tabId, { taskTitle, description, acceptanceCriteria, workItemType });
    }
  );
}

async function fillFields(tabId, apiKey, taskTitle, workItemType) {
  let descriptionPrompt;
  if (workItemType == 'https://ablcode.visualstudio.com/Mojito/_workitems/create/Bug'){
    descriptionPrompt = `Please write a detailed bug description with repro steps for the following defect titled: "${taskTitle}"`;
  } else {
    descriptionPrompt = `Please write a detailed description for the following task titled: "${taskTitle}" The result should begin with "This effort is to"`;
  }
 
  let acceptanceCriteriaPrompt = `Please write the acceptance criteria for the following task titled: "${taskTitle}". Be as concice as possible. Include unit testing.`;

  let description = "Loading Description...";
  let acceptanceCriteria = "Loading Acceptance Criteria..."
  
  runContentScript(tabId, taskTitle, description, acceptanceCriteria, workItemType);

  description = "Title: " + taskTitle + " \n" + await callGPTAPI(tabId, apiKey, descriptionPrompt, workItemType);
  acceptanceCriteria = await callGPTAPI(tabId, apiKey, acceptanceCriteriaPrompt, workItemType);

  runContentScript(tabId, taskTitle, description, acceptanceCriteria, workItemType);
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { apiKey, taskTitle, workItemType } = request;
  console.debug('Task title received:', taskTitle);
  console.debug('Task type received:', workItemType);

  chrome.tabs.create({ url: workItemType }, (tab) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        console.debug('Target tab loaded:', tab.url);
        fillFields(tabId, apiKey, taskTitle, workItemType);
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
});
