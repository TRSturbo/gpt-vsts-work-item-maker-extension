# gpt-vsts-work-item-maker-extension
This is a chrome extension that helps write various VSTS work items for you. It also automagically adds them to the new work item directly in the browser on your behalf. Demo extension, there will definitely be some rough edges.

#Getting Started
1. ##Clone or Download the Repository
    - First, you need to obtain the code from the repository. You can either clone the repository using Git or download it as a ZIP file.

- Option 1: Clone with Git
    - Open a terminal or command prompt and navigate to your desired directory, then run:

    - ```git clone https://github.com/TRSturbo/gpt-vsts-work-item-maker-extension.git```
    - Note: Ensure you have switched to the "develop" branch for the latest changes.

- Option 2: Download ZIP
    - Navigate to the repository's main page on GitHub, and click on the "Code" button near the top right corner. Select "Download ZIP" and save the file to your desired location. Once the download is complete, extract the contents of the ZIP file to a folder.

2. ##Load the Unpacked Extension
###For Google Chrome
- Open Google Chrome.
- Click on the menu button (three vertical dots) in the top right corner of the browser.
- Navigate to "More tools" > "Extensions."
- In the top right corner of the "Extensions" page, enable "Developer mode" by toggling the switch.
- Click on the "Load unpacked" button, which should now be visible in the top left corner of the page.
- Navigate to the folder where you cloned or extracted the repository, and select the folder containing the manifest.json file.
- The extension should now appear in your list of installed extensions.

###For Mozilla Firefox
- Open Mozilla Firefox.
- Type about:debugging in the address bar and press Enter.
- Click on "This Firefox" in the left sidebar.
- Click on the "Load Temporary Add-on..." button.
- Navigate to the folder where you cloned or extracted the repository, and select the manifest.json file.
- The extension should now appear in your list of installed extensions.
- Note: In Firefox, the extension will only be active for the current browsing session. You will need to reload the temporary add-on if you restart the browser.

3. ##Obtain An OpenAI token

###If you do not have an account:
- Go to the OpenAI website (https://openai.com/) and click on the "Sign up for free" button in the top right corner.

- Enter your email address and choose a strong password.

- After creating an account, you'll be prompted to create an API key. Click on the "Create API Key" button.

###If you already have an account:

- Go to the [API keys page for your account](https://platform.openai.com/account/api-keys)

- Give your API key a name (e.g. "My OpenAI API Key") and choose the permissions you want to grant it. You can choose to give it full access or restrict it to specific capabilities.

- Click on the "Create" button to generate your API key.

- Once you've generated your API key, copy it to your clipboard and store it in a safe place.

- You can now use your API key to access OpenAI's services, such as their language models and other AI tools.

