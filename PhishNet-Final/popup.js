document.addEventListener('DOMContentLoaded', function() {
  const viewHistoryButton = document.getElementById('viewHistory');
  const resultDiv = document.getElementById('result');
  const customResultDiv = document.getElementById('customResult');
  const detectCustomPhishingButton = document.getElementById('detectCustomPhishing');
  const customUrlInput = document.getElementById('customUrl');

  function sendMessageToContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'detect-phishing' }, function(response) {
        if (chrome.runtime.lastError) {
          handleError(resultDiv);
        } else {
          handleDetectionResult(resultDiv, response.result);
        }
      });
    });
  }

  function handleDetectionResult(element, result) {
    element.innerHTML = `Current Page: ${result}`;
  }

  function handleError(element) {
    element.innerHTML = 'Current Page: Error detecting phishing';
  }

  function detectPhishingForCustomUrl(url) {
    fetch(chrome.runtime.getURL('phishing_database.json'))
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch the local phishing database');
        }
        return response.json();
      })
      .then(phishingDatabase => {
        const phishingDetected = isPhishing(url, phishingDatabase);
        customResultDiv.innerHTML = phishingDetected ? 'Phishing Detected!' : 'No Phishing Detected';
      })
      .catch(error => {
        console.error('Error:', error.message);
        customResultDiv.innerHTML = 'Error detecting phishing';
      });
  }

  function isPhishing(url, phishingDatabase) {
    const { phishingKeywords, phishingUrls, phishingPatterns } = phishingDatabase;

    const keywordDetected = phishingKeywords.some(keyword => {
      const regex = new RegExp(keyword, 'i');
      return regex.test(url);
    });

    if (keywordDetected) {
      return true;
    }

    const urlDetected = phishingUrls.some(phishingUrl => url.includes(phishingUrl));

    if (urlDetected) {
      return true;
    }

    const patternDetected = phishingPatterns.some(pattern => {
      const regex = new RegExp(pattern.pattern, 'i');
      return regex.test(url);
    });

    return patternDetected;
  }

  sendMessageToContentScript();

  detectCustomPhishingButton.addEventListener('click', function() {
    const customUrl = customUrlInput.value;
    detectPhishingForCustomUrl(customUrl);
  });

  viewHistoryButton.addEventListener('click', function() {
    window.location.href = 'history.html';
  });
});
