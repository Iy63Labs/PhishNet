chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'detect-phishing') {
    // Example: Check if the current URL contains a keyword associated with phishing
    var phishingDetected = window.location.href.includes('phish');
    sendResponse({ result: phishingDetected ? 'Phishing Detected!' : 'No Phishing Detected' });
  }
});
