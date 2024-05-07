document.addEventListener('DOMContentLoaded', function() {
  var detectPhishingButton = document.getElementById('detectPhishing');
  var resultDiv = document.getElementById('result');

  // Call the button click function automatically
  detectPhishingButtonClick();

  detectPhishingButton.addEventListener('click', detectPhishingButtonClick);

  function detectPhishingButtonClick() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'detect-phishing' }, function(response) {
        if (chrome.runtime.lastError) {
          // Handle error
          resultDiv.innerHTML = 'Error detecting phishing';
        } else {
          resultDiv.innerHTML = response.result;
        }
      });
    });
  }
});