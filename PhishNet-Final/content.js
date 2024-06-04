// Function to get the email subject based on the class name within a level 2 header
function getEmailSubject() {
  const subjectElement = document.querySelector('h2.Ha');
  return subjectElement ? subjectElement.textContent : null;
}

// Listen for messages from the extension's popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getEmailSubject') {
    const subject = getEmailSubject();
    sendResponse({ subject: subject });
  }
});
