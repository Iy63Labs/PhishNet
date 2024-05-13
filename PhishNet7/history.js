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
}

// Function to get current date and time
function getCurrentDateTime() {
  var now = new Date();
  var date = now.toLocaleDateString();
  var time = now.toLocaleTimeString();
  return date + ' ' + time;
}

// Update the paragraph with id 'dateTime' with current date and time when the page loads
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('dateTime').innerText = 'Phishing detected on: ' + getCurrentDateTime();
  
  // Call the appendDetection function to add the current detection to the list
  appendDetection(getCurrentDateTime());
});

// Function to handle navigation back to the popup.html page
document.getElementById('goBack').addEventListener('click', function() {
  // Navigate back to the popup.html page
  window.location.href = 'popup.html';
});
