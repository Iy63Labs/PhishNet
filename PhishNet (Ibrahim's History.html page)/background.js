// background.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'detect-phishing') {
    fetch(chrome.runtime.getURL('phishing_database.json'))
      .then(response => response.json())
      .then(phishingDatabase => {
        const phishingDetected =
          checkKeywords(phishingDatabase) ||
          checkUrls(phishingDatabase) ||
          checkPatterns(phishingDatabase);

        sendResponse({ result: phishingDetected ? 'Phishing Detected!' : 'No Phishing Detected' });
      })
      .catch(error => {
        console.error('Error fetching local phishing database:', error);
        sendResponse({ result: 'Error detecting phishing' });
      });

    return true;
  }
});

function checkKeywords(phishingDatabase) {
  return phishingDatabase.phishingKeywords.some(keyword => window.location.href.includes(keyword));
}

function checkUrls(phishingDatabase) {
  return phishingDatabase.phishingUrls.some(url => window.location.href.includes(url));
}

function checkPatterns(phishingDatabase) {
  return phishingDatabase.phishingPatterns.some(pattern => {
    const regex = new RegExp(pattern.pattern);
    return regex.test(window.location.href);
  });
}

// Listen for messages requesting history data
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'get-history') {
    try {
      // Logic to retrieve history data
      sendResponse({ /* History data or error response */ });
    } catch (error) {
      console.error('Error retrieving history data:', error.message);
      sendResponse({ error: 'Error retrieving history data' });
    }
    return true; // Keep the message channel open
  }
});
