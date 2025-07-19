<h3>3. content.js</h3>
<p>This script runs on webpages to add the "Copy" and "Explain" buttons.</p>
<pre><code class="language-javascript">
// content.js

// Find all <pre> elements on the page.
const codeBlocks = document.querySelectorAll('pre');

// Loop through each found code block.
codeBlocks.forEach(block => {
    // We only want to add buttons to blocks that don't already have them.
    if (block.querySelector('.code-actions-container')) {
        return;
    }
    
    block.style.position = 'relative';

    // Create a container for our action buttons.
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'code-actions-container';

    // --- Create the "Copy" button ---
    const copyButton = document.createElement('button');
    copyButton.innerText = 'Copy';
    copyButton.className = 'code-action-button copy-button';
    copyButton.title = 'Copy code to clipboard';
    copyButton.addEventListener('click', () => {
        const codeElement = block.querySelector('code') || block;
        navigator.clipboard.writeText(codeElement.innerText).then(() => {
            copyButton.innerText = 'Copied!';
            setTimeout(() => { copyButton.innerText = 'Copy'; }, 2000);
        });
    });

    // --- Create the "Explain" button ---
    const explainButton = document.createElement('button');
    explainButton.innerHTML = '✨ Explain'; // Using innerHTML to render the emoji
    explainButton.className = 'code-action-button explain-button';
    explainButton.title = 'Get an AI-powered explanation of this code';
    explainButton.addEventListener('click', () => {
        const codeElement = block.querySelector('code') || block;
        const codeToExplain = codeElement.innerText;

        // Show loading state
        explainButton.innerText = 'Thinking...';
        explainButton.disabled = true;

        // Remove any existing explanation box associated with this block
        const oldExplanationBox = block.parentNode.querySelector(`[data-code-block-id="${block.id}"]`);
        if (oldExplanationBox) {
            oldExplanationBox.remove();
        }
        
        // Give the block a unique ID if it doesn't have one, to link it to its explanation
        if (!block.id) {
            block.id = `code-block-${Math.random().toString(36).substr(2, 9)}`;
        }

        // Send message to background script to call the API
        chrome.runtime.sendMessage({ type: 'explainCode', code: codeToExplain }, response => {
            // Restore button state
            explainButton.innerHTML = '✨ Explain';
            explainButton.disabled = false;

            if (response.error) {
                console.error('Error:', response.error);
                // Use a custom modal instead of alert
                showModal(`Error: ${response.error}`);
                return;
            }
            
            if (response.explanation) {
                displayExplanation(block, response.explanation);
            }
        });
    });

    // Append buttons to the container, and the container to the block.
    actionsContainer.appendChild(copyButton);
    actionsContainer.appendChild(explainButton);
    block.appendChild(actionsContainer);
});

function displayExplanation(codeBlock, text) {
    // Create the explanation box
    const explanationBox = document.createElement('div');
    explanationBox.className = 'explanation-box';
    // Link the explanation to the code block
    explanationBox.dataset.codeBlockId = codeBlock.id;

    // Create a simple "Close" button
    const closeButton = document.createElement('button');
    closeButton.innerText = '✕';
    closeButton.title = 'Close explanation';
    closeButton.className = 'explanation-close-button';
    closeButton.onclick = () => explanationBox.remove();

    // Create content area
    const content = document.createElement('div');
    content.className = 'explanation-content';
    // Basic markdown handling for newlines and code blocks
    content.innerHTML = text
        .replace(/```([\s\S]*?)```/g, (match, code) => `<pre><code>${code.trim()}</code></pre>`)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');

    explanationBox.appendChild(closeButton);
    explanationBox.appendChild(content);

    // Append the box after the code block for better layout
    codeBlock.parentNode.insertBefore(explanationBox, codeBlock.nextSibling);
}

// A simple modal for showing errors instead of alert()
function showModal(message) {
    const modal = document.createElement('div');
    modal.className = 'error-modal';
    modal.innerHTML = `
        <div class="error-modal-content">
            <p>${message}</p>
            <button>OK</button>
        </div>
    `;
    modal.querySelector('button').onclick = () => modal.remove();
    document.body.appendChild(modal);
}
</code></pre>
