// Function to append a new detection to the list
function appendDetection(dateTime) {
  // Select the history list element
  const historyList = document.getElementById('historyList');
  
  // Create a new list item
  const listItem = document.createElement('li');
  
  // Set the text content of the list item to the detection information
  listItem.textContent = `Phishing detected on: ${dateTime}`;
  
  // Insert the new list item at the beginning of the history list
  historyList.insertBefore(listItem, historyList.firstChild);
  
  // Clear the list if it exceeds a certain number of entries
  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

// Function to get current date and time
function getCurrentDateTime() {
  const now = new Date();
  return now.toLocaleString(); // Return the date/time in string format
}

// Function to load detection history from localStorage
function loadDetectionHistory() {
  const detections = JSON.parse(localStorage.getItem('phishingDetections')) || [];
  detections.forEach(detection => {
    appendDetection(detection); // Append the full detection object
  });
}

// Function to save a new detection to localStorage
function saveDetection(dateTime) {
  const detections = JSON.parse(localStorage.getItem('phishingDetections')) || [];
  detections.push(dateTime); // Store dateTime as a string
  localStorage.setItem('phishingDetections', JSON.stringify(detections));
}

// Function to handle a new phishing threat detection
function detectPhishingThreat() {
  const currentDateTime = getCurrentDateTime();
  saveDetection(currentDateTime);
  appendDetection(currentDateTime);
}

// Load previous detection history on page load
document.addEventListener('DOMContentLoaded', function() {
  loadDetectionHistory();
});

// Function to handle navigation back to the popup.html page
document.getElementById('goBack').addEventListener('click', function() {
  // Navigate back to the popup.html page
  window.location.href = 'popup.html';
});
