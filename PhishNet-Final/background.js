// Listen for messages from other scripts (e.g., history.js)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'get-detection-data') {
    // Record the current time when phishing is detected
    const detectionTime = new Date().toLocaleString();

    // Send the detection time in the response
    sendResponse({ time: detectionTime });
  } else if (request.type === 'detect-phishing') {
    fetch(chrome.runtime.getURL('phishing_database.json'))
      .then(response => response.json())
      .then(phishingDatabase => {
        const phishingDetected =
          checkKeywords(phishingDatabase) ||
          checkUrls(phishingDatabase) ||
          checkPatterns(phishingDatabase);

        if (phishingDetected) {
          const detectionTime = new Date().toLocaleString();
          recordDetection(detectionTime); // Record detection time only when phishing is detected
        }

        sendResponse({ result: phishingDetected ? 'Phishing Detected!' : 'No Phishing Detected' });
      })
      .catch(error => {
        console.error('Error fetching local phishing database:', error);
        sendResponse({ result: 'Error detecting phishing' });
      });

    return true;
  } else if (request.type === 'get-history') {
    try {
      // Logic to retrieve history data
      const historyData = retrieveHistoryData(); // Implement your logic here
      sendResponse({ history: historyData });
    } catch (error) {
      console.error('Error retrieving history data:', error.message);
      sendResponse({ error: 'Error retrieving history data' });
    }
    return true; // Keep the message channel open
  }
});

// Function to check for keywords in the phishing database
function checkKeywords(phishingDatabase) {
  return phishingDatabase.phishingKeywords.some(keyword => window.location.href.includes(keyword));
}

// Function to check for URLs in the phishing database
function checkUrls(phishingDatabase) {
  return phishingDatabase.phishingUrls.some(url => window.location.href.includes(url));
}

// Function to check for patterns in the phishing database
function checkPatterns(phishingDatabase) {
  return phishingDatabase.phishingPatterns.some(pattern => {
    const regex = new RegExp(pattern.pattern);
    return regex.test(window.location.href);
  });
}

// Function to record the time of phishing detection
function recordDetection(dateTime) {
  let detections = JSON.parse(localStorage.getItem('phishingDetections')) || [];
  detections.push(dateTime);
  localStorage.setItem('phishingDetections', JSON.stringify(detections));
}

function retrieveHistoryData() {
  // Implement your logic to retrieve history data here
}
