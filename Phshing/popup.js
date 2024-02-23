document.addEventListener('DOMContentLoaded', function() {
  var detectPhishingButton = document.getElementById('detectPhishing');
  var resultDiv = document.getElementById('result');

  detectPhishingButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'detect-phishing' }, function(response) {
        resultDiv.innerHTML = response.result;
      });
    });
  });
});
