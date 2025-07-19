
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message is for explaining code.
    if (request.type === 'explainCode') {
        const code = request.code;

        // Retrieve the API key from Chrome's synchronized storage.
        chrome.storage.sync.get(['apiKey'], async (result) => {
            const apiKey = result.apiKey;

            if (!apiKey) {
                sendResponse({ error: 'API key not set. Please click the extension icon to set it.' });
                return;
            }

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const prompt = `Explain the following code snippet clearly and concisely. Format your response using Markdown, including formatting for code blocks:\n\n\`\`\`\n${code}\n\`\`\``;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || `API request failed with status ${response.status}`);
                }

                const data = await response.json();
                
                if (data.candidates && data.candidates.length > 0) {
                    const explanation = data.candidates[0].content.parts[0].text;
                    sendResponse({ explanation: explanation });
                } else {
                    // This case handles situations where the API returns a 200 OK but with no candidates,
                    // often due to safety settings blocking the prompt or response.
                    const blockReason = data.promptFeedback?.blockReason || 'No content returned from API.';
                    throw new Error(`API call succeeded but returned no explanation. Reason: ${blockReason}`);
                }

            } catch (error) {
                console.error('Error calling Gemini API:', error);
                sendResponse({ error: `Failed to get explanation: ${error.message}` });
            }
        });

        // Return true to indicate that we will send a response asynchronously.
        return true; 
    }
});
