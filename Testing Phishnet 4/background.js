// background.js

function getHistoryData() {
  return new Promise((resolve, reject) => {
    chrome.history.search({text: '', maxResults: 10}, function(data) {
      resolve(data);
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'get-history') {
    getHistoryData()
      .then(historyData => {
        sendResponse({ historyData: historyData });
      })
      .catch(error => {
        sendResponse({ error: 'Error retrieving history data' });
      });
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
