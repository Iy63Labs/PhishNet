// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'detect-phishing') {
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

        sendResponse({ result: phishingDetected ? 'Phishing Detected!' : 'No Phishing Detected' });
      })
      .catch(error => {
        console.error('Error:', error.message);
        sendResponse({ result: 'Error detecting phishing' });
      });

    // Ensure you return true to keep the message channel open for sendResponse
    return true;
  }
});

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
