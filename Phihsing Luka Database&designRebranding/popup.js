document.addEventListener('DOMContentLoaded', function() {
  const detectPhishingButton = document.getElementById('detectPhishing');
  const resultDiv = document.getElementById('result');

  // Automatically call the button click function
  detectPhishingButtonClick();

  detectPhishingButton.addEventListener('click', detectPhishingButtonClick);

  function detectPhishingButtonClick() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'detect-phishing' }, function(response) {
        if (chrome.runtime.lastError) {
          // Handle error
          resultDiv.textContent = 'Error detecting phishing';
        } else {
          resultDiv.textContent = response.result;
        }
      });
    });
  }
});
