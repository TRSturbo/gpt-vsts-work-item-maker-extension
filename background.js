//openAI API method
//on success, returns the trimmed message response
//on failure, runs the content script with the error details so the user can see
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

//code to trigger the page content injecting
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

//main function to generate prompts, get answers and call the content injecting method to update the open tab
async function fillFields(tabId, apiKey, taskOverview, workItemType) {

  //create the prompts for Title, Description and AC
  let titlePrompt = `Please write the title for the following task as described: "${taskOverview}". Be as concice as possible.`;

  //determine if item type is bug, we need to feed a more custom defect related prompt to the AI
  let descriptionPrompt;
  if (workItemType.includes("create/Bug")){
    descriptionPrompt = `Please write a detailed bug description with repro steps for the following defect as described: "${taskOverview}"`;
  } else {
    descriptionPrompt = `Please write a detailed description for the following task as described: "${taskOverview}" The result should begin with "This effort is to"`;
  }
  let acceptanceCriteriaPrompt = `Please write the acceptance criteria for the following task as described: "${taskOverview}". Be as concice as possible. Include unit testing.`;
  
  runContentScript(tabId, "Loading Title...", "Loading Description...", "Loading Acceptance Criteria...", workItemType);

  let taskTitle = await callGPTAPI(tabId, apiKey, titlePrompt, workItemType);
  console.debug("task title: " + taskTitle);
  runContentScript(tabId, taskTitle, "Loading Description...", "Loading Acceptance Criteria...", workItemType);
  let description = "Title: " + taskTitle + " \n" + await callGPTAPI(tabId, apiKey, descriptionPrompt, workItemType);
  runContentScript(tabId, taskTitle, description, "Loading Acceptance Criteria...", workItemType);
  let acceptanceCriteria = await callGPTAPI(tabId, apiKey, acceptanceCriteriaPrompt, workItemType);
  runContentScript(tabId, taskTitle, description, acceptanceCriteria, workItemType);
}

//listener function to recieve message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { apiKey, taskOverview, workItemType } = request;

  chrome.tabs.create({ url: workItemType }, (tab) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        fillFields(tabId, apiKey, taskOverview, workItemType);
        chrome.tabs.onUpdated.removeListener(listener);
      }
    });
  });
});
