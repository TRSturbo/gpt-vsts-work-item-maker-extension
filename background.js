const Field = Object.freeze({
  TITLE: 'title',
  DESCRIPTION: 'description',
  AC: 'ac',
});

let finalTitle = '';
let finalDescription = '';
let finalAcceptanceCriteria = '';

async function callGPTAPI(tabId, apiKey, prompt, workItemType, field, callback) {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  let jsonString = '';
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
      stream: true, // Add the stream parameter
    }),
  });

  if (!response.body) {
    throw new Error('ReadableStream not yet supported in your browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let parsedData = '';
  let content = '';

const processStream = async () => {
  const { value, done } = await reader.read();
  if (done) {
    console.log('Stream complete');
    jsonString = '';
    callback(); // Invoke the callback when the stream is complete
    return;
  }

  jsonString += decoder.decode(value, { stream: true });

  // Check for the closing brace '}' of the JSON object
  const closingBraceIndex = jsonString.lastIndexOf('}');
  if (closingBraceIndex !== -1) {
    // Extract the valid JSON part and keep the rest for future processing
    const validJsonString = jsonString.substring(0, closingBraceIndex + 1);
    jsonString = jsonString.substring(closingBraceIndex + 1);

    try {
      parsedData = JSON.parse(validJsonString.replace('data: ', ''));

      if (parsedData.choices) {
        content = parsedData.choices[0].delta.content;
        if (field == Field.TITLE) {
          finalTitle += content;
          runContentScript(tabId, finalTitle, workItemType, field);
        } else if (field == Field.DESCRIPTION) {
          finalDescription += content;
          runContentScript(tabId, finalDescription, workItemType, field);
        } else if (field == Field.AC) {
          finalAcceptanceCriteria += content;
          runContentScript(tabId, finalAcceptanceCriteria, workItemType, field);
        }
      }
    } catch (error) {
      // Do nothing, wait for more data
      console.log("err: " + error + " parsedData: " + JSON.stringify(jsonString));
    }
  }

  setTimeout(processStream, 0);
};

  try {
    await processStream();
  } catch (error) {
    console.error('Error while processing stream:', error);
    runContentScript(tabId, "Error loading description from OpenAI API, please try again later. Error Code: " + response.status + " Reason: " + error.message, workItemType, Field.DESCRIPTION);
    throw new Error('GPT API response is not as expected');
  }
}



//code to trigger the page content injecting
async function runContentScript(tabId, content, workItemType, field) {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ['content.js'],
    },
    () => {
      chrome.tabs.sendMessage(tabId, { content, workItemType, field: field });
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
  
  runContentScript(tabId, "Loading Title...", workItemType, Field.TITLE);
  runContentScript(tabId, "Loading Description...", workItemType, Field.DESCRIPTION);
  runContentScript(tabId, "Loading Acceptance Criteria...", workItemType, Field.AC);

  callGPTAPI(tabId, apiKey, titlePrompt, workItemType, Field.TITLE, function(titleResult) {
    finalTitle = '';
    callGPTAPI(tabId, apiKey, descriptionPrompt, workItemType, Field.DESCRIPTION, function(descResult) {
      finalDescription = '';
      callGPTAPI(tabId, apiKey, acceptanceCriteriaPrompt, workItemType, Field.AC, function(acResult) {
        finalAcceptanceCriteria = '';
      });
    });
  });
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
