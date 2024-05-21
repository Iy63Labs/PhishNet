document.addEventListener('DOMContentLoaded', function () {
  const detectPhishingButton = document.getElementById('detectPhishing');
  const viewHistoryButton = document.getElementById('viewHistory');
  const resultDiv = document.getElementById('result');

  function sendMessageToContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'detect-phishing' }, function (response) {
        if (chrome.runtime.lastError) {
          handleError();
        } else {
          handleDetectionResult(response.result);
        }
      });
    });
  }

  function handleDetectionResult(result) {
    resultDiv.innerHTML = result;
  }

  function handleError() {
    resultDiv.innerHTML = 'Error detecting phishing';
  }

  detectPhishingButton.addEventListener('click', function () {
    sendMessageToContentScript();
  });
 viewHistoryButton.addEventListener('click', function() {
    window.location.href = 'history.html';
});

  viewHistoryButton.addEventListener('click', function() {
    window.location.href = 'history.html';
  });
});