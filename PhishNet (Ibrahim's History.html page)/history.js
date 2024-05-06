document.addEventListener('DOMContentLoaded', function() {
  const goBackButton = document.getElementById('goBack');

  // Function to populate history data in history.html
  function populateHistory(historyData) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Clear existing history list

    // Iterate through each history entry and populate the list
    historyData.forEach(entry => {
      const listItem = document.createElement('li');
      listItem.classList.add('history-item');

      const timestamp = document.createElement('p');
      timestamp.classList.add('timestamp');
      // Format the date and time
      const detectionTime = new Date(entry.timestamp);
      const formattedTime = `${detectionTime.toLocaleTimeString()} on ${detectionTime.toLocaleDateString()}`;
      timestamp.textContent = `Phishing detected at ${formattedTime}`;
      listItem.appendChild(timestamp);

      const detectionResult = document.createElement('p');
      detectionResult.textContent = entry.result ? 'Phishing Detected' : 'No Phishing Detected';
      listItem.appendChild(detectionResult);

      historyList.appendChild(listItem);
    });
  }

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

  // Navigate back to popup.html when Go Back button is clicked
  goBackButton.addEventListener('click', function() {
    window.location.href = 'popup.html';
  });
});
