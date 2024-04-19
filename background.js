// Listen for the "webNavigation" event
chrome.webNavigation.onCompleted.addListener(function(details) {
    // Check if the current website is a phishing website
    if (isPhishingWebsite(details.url)) {
      // Create and display the pop-up window
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 200
      });
    }
  });