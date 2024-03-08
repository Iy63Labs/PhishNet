chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'detect-phishing') {
    fetch(chrome.runtime.getURL('phishing_database.json'))
      .then(response => response.json())
      .then(phishingDatabase => {
        const { phishingKeywords, phishingUrls, phishingPatterns } = phishingDatabase;
        const currentUrl = window.location.href;

        const isPhishingDetected =
          phishingKeywords.some(keyword => currentUrl.includes(keyword)) ||
          phishingUrls.some(url => currentUrl.includes(url)) ||
          phishingPatterns.some(pattern => new RegExp(pattern.pattern).test(currentUrl));

        sendResponse({ result: isPhishingDetected ? 'Phishing Detected!' : 'No Phishing Detected' });
      })
      .catch(error => {
        console.error('Error fetching local phishing database:', error);
        sendResponse({ result: 'Error detecting phishing' });
      });

    return true;
  }
});
