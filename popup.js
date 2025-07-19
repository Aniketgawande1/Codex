document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const statusDiv = document.getElementById('status');

    chrome.storage.sync.get(['apiKey'], (result) => {
        if (result.apiKey) {
            apiKeyInput.placeholder = "API Key is set";
        }
    });

    document.getElementById('save').addEventListener('click', () => {
        const apiKey = apiKeyInput.value;
        if (!apiKey) {
            statusDiv.textContent = 'Please enter a key.';
            statusDiv.style.color = 'red';
            return;
        }
        chrome.storage.sync.set({ apiKey }, () => {
            statusDiv.textContent = 'API Key saved!';
            statusDiv.style.color = 'green';
            apiKeyInput.value = '';
        });
    });
});
