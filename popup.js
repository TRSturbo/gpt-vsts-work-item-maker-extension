document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const taskOverviewInput = document.getElementById('taskOverview');
  const vstsProjectNameInput = document.getElementById('vstsProjectName');
  const vstsOrgNameInput = document.getElementById('vstsOrgName');
  const submitButton = document.getElementById('createTask');

  const getFromStorage = (key, input) => {
    chrome.storage.sync.get(key, (data) => {
    if (data[key]) {
      input.value = data[key];
    }
    });
  };

  getFromStorage('openai_api_key', apiKeyInput);
  getFromStorage('vsts_org_name', vstsOrgNameInput);
  getFromStorage('vsts_project_name', vstsProjectNameInput);

  function getSelectedValue() {
    const selectElement = document.getElementById('workItemType');
    const selectedValue = selectElement.options[selectElement.selectedIndex].value
    return selectedValue;
  }

  submitButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    const vstsProjectName = vstsProjectNameInput.value;
    const vstsOrgName = vstsOrgNameInput.value;
    const taskOverview = taskOverviewInput.value;
    const workItemType = getSelectedValue().replace(/\*\*\*/g, vstsProjectName).replace(/\$\$\$/g, vstsOrgName);

    if (apiKey && taskOverview && vstsProjectName && vstsOrgName) {
      chrome.storage.sync.set({ openai_api_key: apiKey, vsts_project_name: vstsProjectName, vsts_org_name: vstsOrgName }, () => {
        chrome.runtime.sendMessage({ apiKey, taskOverview, workItemType });
      });
    } else {
      alert('Please enter both OpenAI API Key and Task Overview.');
    }
  });
});
