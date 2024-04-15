// Function to send a message to the background script requesting history data
function requestHistoryData() {
  return new Promise((resolve, reject) => {
    // Send message to background script
    chrome.runtime.sendMessage({ type: 'get-history' }, function(response) {
      if (chrome.runtime.lastError) {
        // Handle error if message could not be sent
        reject(chrome.runtime.lastError.message);
      } else if (response.error) {
        // Handle error if response contains an error message
        reject(new Error(response.error));
      } else {
        // Resolve with history data if successful
        resolve(response.historyData);
      }
    });
  });
}

// Function to populate history data in history.html
function populateHistory(historyData) {
  // Replace this with actual code to populate history in history.html
  console.log('History data:', historyData);
}

// Function to detect phishing
function detectPhishing() {
  // Fetch the local phishing database
  fetch(chrome.runtime.getURL('phishing_database.json'))
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch the local phishing database');
      }
      return response.json();
    })
    .then(phishingDatabase => {
      // Check if the current URL contains any phishing keywords, is in the phishing URLs list, or matches phishing patterns
      const phishingDetected = isPhishing(phishingDatabase);

      // Send the result of phishing detection
      chrome.runtime.sendMessage({ type: 'phishing-detected', result: phishingDetected });

      // Retrieve history data after phishing detection and display it
      requestHistoryData()
        .then(historyData => {
          // Populate history data in history.html
          populateHistory(historyData);
        })
        .catch(error => {
          console.error('Error retrieving history data:', error);
          // Handle error (e.g., display an error message to the user)
        });
    })
    .catch(error => {
      console.error('Error:', error.message);
      chrome.runtime.sendMessage({ type: 'phishing-detected', result: 'Error detecting phishing' });
    });
}

// Function to check if the current URL is phishing
function isPhishing(phishingDatabase) {
  const { phishingKeywords, phishingUrls, phishingPatterns } = phishingDatabase;

  // Check if the current URL contains any phishing keywords
  const keywordDetected = phishingKeywords.some(keyword => {
    const regex = new RegExp(keyword, 'i');
    return regex.test(window.location.href);
  });

  if (keywordDetected) {
    return true;
  }

  // Check if the current URL is in the phishing URLs list
  const urlDetected = phishingUrls.some(url => window.location.href.includes(url));

  if (urlDetected) {
    return true;
  }

  // Check if the current URL matches any phishing patterns
  const patternDetected = phishingPatterns.some(pattern => {
    const regex = new RegExp(pattern.pattern, 'i');
    return regex.test(window.location.href);
  });

  return patternDetected;
}

// Event listener when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Detect phishing when the DOM content is loaded
  detectPhishing();
});
