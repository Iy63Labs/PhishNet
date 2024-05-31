const API_KEY = 'AIzaSyDh0dEIja_W-5scVuXvwCzwLPM1OV7cBaI';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'detect-phishing') {
    if (request.context === 'url') {
      detectPhishingOnCurrentPage(sendResponse);
    } else if (request.context === 'email') {
      handleGmailApiRequest(sendResponse);
    }
    return true; // Will respond asynchronously
  }
});

function detectPhishingOnCurrentPage(sendResponse) {
  // Assume phishingDatabase is a JSON file with known phishing URLs
  fetch(chrome.runtime.getURL('phishing_database.json'))
    .then(response => response.json())
    .then(database => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const currentUrl = new URL(tabs[0].url);
        const isPhishing = database.urls.includes(currentUrl.hostname);
        if (isPhishing) {
          sendResponse({ result: 'Warning: This site is potentially a phishing site.' });
        } else {
          sendResponse({ result: 'This site appears to be safe.' });
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({ result: 'Error checking phishing database' });
    });
}

function handleGmailApiRequest(sendResponse) {
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
      sendResponse({ result: 'Error: ' + chrome.runtime.lastError.message });
      return;
    }

    fetch(`https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=1&q=is:unread&key=${API_KEY}`, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (!data.messages || data.messages.length === 0) {
        sendResponse({ result: 'No unread messages found.' });
        return;
      }

      const messageId = data.messages[0].id;
      return fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}?key=${API_KEY}`, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
    })
    .then(response => response.json())
    .then(message => {
      const headers = message.payload.headers;
      const subjectHeader = headers.find(header => header.name === 'Subject');
      const subject = subjectHeader ? subjectHeader.value : 'No Subject';
      const snippet = message.snippet || 'No Message Content';

      // Here, you would call your phishing detection function on the email content
      // For now, we'll just confirm access to the email
      sendResponse({ result: `Subject: Has access\nMessage: Has access` });
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({ result: 'Error accessing Gmail API' });
    });
  });
}
