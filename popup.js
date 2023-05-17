document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('apiKey');
  const taskOverviewInput = document.getElementById('taskOverview');
  const vstsProjectNameInput = document.getElementById('vstsProjectName');
  const vstsOrgNameInput = document.getElementById('vstsOrgName');
  const submitButton = document.getElementById('createTask');
  const workItemTypeSelect = document.getElementById('workItemType');
  const darkModeToggle = document.getElementById('darkModeToggle');

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
  getFromStorage('task_overview', taskOverviewInput);

  taskOverviewInput.addEventListener('input', () => {
    chrome.storage.sync.set({ task_overview: taskOverviewInput.value });
  });

  function getSelectedValue() {
    return workItemTypeSelect.value;
  }

  submitButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value;
    const vstsProjectName = vstsProjectNameInput.value;
    const vstsOrgName = vstsOrgNameInput.value;
    const taskOverview = taskOverviewInput.value;
    const workItemType = getSelectedValue().replace(/\*\*\*/g, vstsProjectName).replace(/\$\$\$/g, vstsOrgName);

    if (apiKey && taskOverview && vstsProjectName && vstsOrgName) {
      chrome.storage.sync.set(
        { openai_api_key: apiKey, vsts_project_name: vstsProjectName, vsts_org_name: vstsOrgName },
        () => {
          chrome.runtime.sendMessage({ apiKey, taskOverview, workItemType });
        }
      );
    } else {
      alert('Please enter both OpenAI API Key and Task Overview.');
    }
  });

  darkModeToggle.addEventListener('change', () => {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const isDarkModeEnabled = darkModeToggle.checked;
    chrome.storage.sync.set({ dark_mode: isDarkModeEnabled });
  });

  workItemTypeSelect.addEventListener('change', () => {
    const selectedValue = getSelectedValue();
    chrome.storage.sync.set({ work_item_type: selectedValue });
  });

  chrome.storage.sync.get(['dark_mode', 'work_item_type'], (data) => {
    const isDarkModeEnabled = data.dark_mode;
    const selectedWorkItemType = data.work_item_type;

    darkModeToggle.checked = isDarkModeEnabled;
    workItemTypeSelect.value = selectedWorkItemType;

    if (isDarkModeEnabled) {
      document.body.classList.add('dark-mode');
    }
  });
});
