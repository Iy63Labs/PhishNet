document.addEventListener('DOMContentLoaded', function() {
  var detectPhishingButton = document.getElementById('detectPhishing');
  var resultDiv = document.getElementById('result');

  detectPhishingButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'detect-phishing' }, function(response) {
<<<<<<< HEAD:Phshing/popup.js
    	resultDiv.innerHTML = response.result;
=======
        if (chrome.runtime.lastError) {
          // Handle error
          resultDiv.innerHTML = 'Error detecting phishing';
        } else {
          resultDiv.innerHTML = response.result;
        }
>>>>>>> 983809c5dfffd0e807dc7b19980ff2afbd84c17a:Phshing-luka main/popup.js
      });
    });
  });
});
