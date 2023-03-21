# gpt-vsts-work-item-maker-extension
This is a chrome extension that helps write various VSTS work items for you. It also automagically adds them to the new work item directly in the browser on your behalf. Demo extension, there will definitely be some rough edges.

# Getting Started
1. ## Clone or Download the Repository
    - First, you need to obtain the code from the repository. You can either clone the repository using Git or download it as a ZIP file.

- Option 1: Clone with Git
    - Open a terminal or command prompt and navigate to your desired directory, then run:

    - ```git clone https://github.com/TRSturbo/gpt-vsts-work-item-maker-extension.git```
    - Note: Ensure you have switched to the "develop" branch for the latest changes.

- Option 2: Download ZIP
    - Stable: Download the latest stable release from the "Releases" page
    - Unstable: Navigate to the repository's main page on GitHub and select the "develop" branch. Click on the "Code" button near the top right corner. Select "Download ZIP" and save the file to your desired location. Once the download is complete, extract the contents of the ZIP file to a folder.

2. # #Load the Unpacked Extension
### For Google Chrome
- Open Google Chrome.
- Click on the menu button (three vertical dots) in the top right corner of the browser.
- Navigate to "More tools" > "Extensions."
- In the top right corner of the "Extensions" page, enable "Developer mode" by toggling the switch.
- Click on the "Load unpacked" button, which should now be visible in the top left corner of the page.
- Navigate to the folder where you cloned or extracted the repository, and select the folder containing the manifest.json file.
- The extension should now appear in your list of installed extensions.

### For Mozilla Firefox
- Open Mozilla Firefox.
- Type about:debugging in the address bar and press Enter.
- Click on "This Firefox" in the left sidebar.
- Click on the "Load Temporary Add-on..." button.
- Navigate to the folder where you cloned or extracted the repository, and select the manifest.json file.
- The extension should now appear in your list of installed extensions.
- Note: In Firefox, the extension will only be active for the current browsing session. You will need to reload the temporary add-on if you restart the browser.

3. ## Obtain An OpenAI token

### If you do not have an account:
- Go to the OpenAI website (https://openai.com/) and click on the "Sign up for free" button in the top right corner.

- Enter your email address and choose a strong password.

- After creating an account, you'll be prompted to create an API key. Click on the "Create API Key" button.

### If you already have an account:

- Go to the [API keys page for your account](https://platform.openai.com/account/api-keys)

- Give your API key a name (e.g. "My OpenAI API Key") and choose the permissions you want to grant it. You can choose to give it full access or restrict it to specific capabilities.

- Click on the "Create" button to generate your API key.

- Once you've generated your API key, copy it to your clipboard and store it in a safe place.

- You can now use your API key to access OpenAI's services, such as their language models and other AI tools.

# Usage

1. To use the extension, you can simply click on the extension icon from your browser, an you will be met with the creation popup:

### The Popup Dialog
![Popup](/.attachments/popup.png)

2. Fill out the blanks as follows:
- OpenAI API Key
    - This is the API key you generated in the setup inscructions above
- VSTS Organization Name:
    - The name of your organization. This is to populate the correct URL for creating the work item:
    - https://{YOUR_ORG_NAME_HERE}.visualstudio.com/
- VSTS Project Name:
    - The name of your project within your organization. This is to populate the correct URL for creating the work item:
    - "https://{YOUR_ORG_NAME_HERE}.visualstudio.com/{YOUR_PROJECT_NAME_HERE}/workitems/create/
- Describe The Task:
    - A general description of what you want the task to include. You may be as detailed or as concise as you want, but the more details you provide the close the outcome typically is to your desired outcome.
    - From this description, the extension will generate:
        - The title of the task
        - The description/repro steps for the task
        - The acceptance criteria for the task
- Type:
    - This sleector will allow you to change the desire work item type between:
        - PBI
        - Bug
        - Feature

3. Click "Create Task"
    - A new tab will open to the creation page of the selected work item type 
4. Please wait while the GPT API is queries for the needed fields
    - Any errors that may occur will present themselves in the description and acceptance criteria fields for now
5. Relax and enjoy as your work items is filled in autmagically!

### Notes:
- You may of course need to edit the output to your desired needs if it does not completely line up with your expectation.

### Known Issues:
- The title does not correctly auto populate
    - Workaround: Copy and paste the title that is also included at the top of the description
- The extension will not work if you are not logged into VSTS already

### Example Output Screens:
![Loading Example](/.attachments/loading_example.png)
![Completed Example](/.attachments/completed_example.png)

