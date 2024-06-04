document.addEventListener('DOMContentLoaded', function() {
  const historyList = document.getElementById('historyList');

  // Get the browser history and populate the list
  chrome.history.search({ text: '', maxResults: 1000 }, function(historyItems) {
    for (const historyItem of historyItems) {
      const listItem = document.createElement('li');
      const url = document.createElement('a');
      url.href = historyItem.url;
      url.textContent = historyItem.url;
      url.target = '_blank';
      listItem.appendChild(url);
      historyList.appendChild(listItem);
    }
  });
});