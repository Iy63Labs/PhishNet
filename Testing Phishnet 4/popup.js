document.addEventListener('DOMContentLoaded', function() {
  var detectPhishingButton = document.getElementById('detectPhishing');
  var showHistoryButton = document.getElementById('showHistory');
  var resultDiv = document.getElementById('result');

  detectPhishingButton.addEventListener('click', function() {
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
  });

  showHistoryButton.addEventListener('click', function() {
    // Change the content of the popup to history.html
    fetch(chrome.runtime.getURL('history.html'))
      .then(response => response.text())
      .then(data => {
        document.body.innerHTML = data;
        // Add event listener for the Go Back button in history.html
        var goBackButton = document.getElementById('goBack');
        goBackButton.addEventListener('click', function() {
          // Reload popup.html when the Go Back button is clicked
          window.location.reload();
        });
      })
      .catch(error => {
        console.error('Error loading history.html:', error);
      });
  });
});


