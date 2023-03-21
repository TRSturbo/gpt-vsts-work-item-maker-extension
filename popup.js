document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const taskTitleInput = document.getElementById('taskTitle');
  const submitButton = document.getElementById('createTask');

  chrome.storage.sync.get('openai_api_key', (data) => {
    if (data.openai_api_key) {
      apiKeyInput.value = data.openai_api_key;
    }
  });

  function getSelectedValue() {
    const selectElement = document.getElementById('workItemType');
    const selectedValue = selectElement.options[selectElement.selectedIndex].value;
    console.log("Selected value: ", selectedValue);
    return selectedValue;
  }

  submitButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    const taskTitle = taskTitleInput.value;
    const workItemType = getSelectedValue();

    if (apiKey && taskTitle) {
      chrome.storage.sync.set({ openai_api_key: apiKey }, () => {
        chrome.runtime.sendMessage({ apiKey, taskTitle, workItemType });
      });
    } else {
      alert('Please enter both OpenAI API Key and Task Title.');
    }
  });
});
