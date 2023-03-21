document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const taskTitleInput = document.getElementById('taskTitle');
  const vstsProjectNameInput = document.getElementById('vstsProjectName');
  const vstsOrgNameInput = document.getElementById('vstsOrgName');
  const submitButton = document.getElementById('createTask');

  chrome.storage.sync.get('openai_api_key', (data) => {
    if (data.openai_api_key) {
      apiKeyInput.value = data.openai_api_key;
    }
  });

  chrome.storage.sync.get('vsts_org_name', (data) => {
    if (data.vsts_org_name) {
      vstsOrgNameInput.value = data.vsts_org_name;
    }
  });

    chrome.storage.sync.get('vsts_project_name', (data) => {
    if (data.vsts_project_name) {
      vstsProjectNameInput.value = data.vsts_project_name;
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
    const vstsProjectName = vstsProjectNameInput.value;
    const vstsOrgName = vstsOrgNameInput.value;
    const taskTitle = taskTitleInput.value;
    const workItemType = getSelectedValue().replace(/\*\*\*/g, vstsProjectName).replace(/\$\$\$/g, vstsOrgName);

    if (apiKey && taskTitle && vstsProjectName && vstsOrgName) {
      chrome.storage.sync.set({ openai_api_key: apiKey, vsts_project_name: vstsProjectName, vsts_org_name: vstsOrgName }, () => {
        chrome.runtime.sendMessage({ apiKey, taskTitle, workItemType });
      });
    } else {
      alert('Please enter both OpenAI API Key and Task Title.');
    }
  });
});
