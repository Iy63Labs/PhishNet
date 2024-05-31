// Function to append a new detection to the list
function appendDetection(dateTime) {
  // Select the history list element
  const historyList = document.getElementById('historyList');
  
  // Create a new list item
  const listItem = document.createElement('li');
  
  // Set the text content of the list item to the detection information
  listItem.textContent = `Phishing detected on: ${dateTime}`;
  
  // Append the new list item to the history list
  historyList.appendChild(listItem);
}

function requestDetectionData() {
  // Send message to background script to request detection data
  chrome.runtime.sendMessage({ type: 'get-detection-data' }, function(response) {
    if (response && response.time) {
      // If response contains detection time, append it to the history list
      appendDetection(response.time);
    } else {
      // If no detection data available, display a message
      const historyList = document.getElementById('historyList');
      historyList.innerHTML = '<li>No phishing detection history</li>';
    }
  });
}
// Load previous detection history on page load
document.addEventListener('DOMContentLoaded', function() {
  // Request detection data from background script
  requestDetectionData();
});

// Function to handle navigation back to the popup.html page
document.getElementById('goBack').addEventListener('click', function() {
  // Navigate back to the popup.html page
  window.location.href = 'popup.html';
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'detection-data') {
    // If message contains detection data, append it to the history list
    appendDetection(request.time);
  }
});
