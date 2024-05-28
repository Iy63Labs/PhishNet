document.addEventListener('DOMContentLoaded', function() {
  var detectPhishingButton = document.getElementById('detectPhishing');
  var resultDiv = document.getElementById('result');
  var contextSelect = document.getElementById('detectionContext');

  detectPhishingButton.addEventListener('click', detectPhishingButtonClick);

  function detectPhishingButtonClick() {
    var context = contextSelect.value; // Get the selected context

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'detect-phishing', context: context }, function(response) {
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
