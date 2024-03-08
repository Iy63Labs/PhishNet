// Usage in main code
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'detect-phishing') {
      // Parse the current URL
      var urlParts = new URL(window.location.href);

      // Use the function to set phishingDetected
      var phishingDetected = checkForPhishing(urlParts);

      // Send the response based on the phishing detection result
      sendResponse({ result: phishingDetected ? 'Phishing Detected!' : 'No Phishing Detected' });
  }

function checkForPhishing(urlParts) {
  // Check if the hostname part of the URL consists only of numbers and dots
  var onlyNumbersDetected = /^[0-9.]+$/.test(urlParts.hostname);

  // Check if the URL contains the string 'phish'
  var characterDetected = urlParts.href.includes('phish');

  // Checks for typosquatting or similar-looking domain names
  var googleLikeDetected = /.*g[^\/]*o[^\/]*o[^\/]*g[^\/]*l[^\/]*e.*/.test(urlParts.hostname);
  var instagramLikeDetected = /.*i[^\/]*n[^\/]*s[^\/]*t[^\/]*a[^\/]*g[^\/]*r[^\/]*a[^\/]*m.*/.test(urlParts.hostname);
  var tiktokLikeDetected = /.*t[^\/]*i[^\/]*k[^\/]*t[^\/]*o[^\/]*k.*/.test(urlParts.hostname);
  var paypalLikeDetected = /.*p[^\/]*a[^\/]*y[^\/]*p[^\/]*a[^\/]*l.*/.test(urlParts.hostname);

  // Check for excessive hyphens in the URL
  var excessiveHyphensDetected = (urlParts.hostname.match(/-/g) || []).length > 2;

  // Check for mixed script characters to prevent IDN homograph attacks
  function containsMixedScripts(url) {
    // Regular expression to match Latin script characters
    const latinScriptRegex = /\p{Script=Latin}/u;
    // Regular expression to match characters from scripts other than Latin
    const nonLatinScriptRegex = /[^\p{Script=Latin}\p{Punctuation}\p{Nd}]/u; // Nd for decimal numbers, Punctuation for punctuation

      // Check if the URL contains Latin script characters
    const containsLatin = latinScriptRegex.test(url);
    // Check if the URL contains non-Latin script characters
    const containsNonLatin = nonLatinScriptRegex.test(url);

    // Return true if the URL contains both Latin and non-Latin script characters
    return containsLatin && containsNonLatin;
}
  var mixedScriptDetected = containsMixedScripts(urlParts.hostname); 

  // Combine all checks
  return onlyNumbersDetected || characterDetected || googleLikeDetected || facebookLikeDetected ||
         instagramLikeDetected || tiktokLikeDetected || paypalLikeDetected || 
         excessiveHyphensDetected || mixedScriptDetected || !urlParts.href.startsWith('https://');
}

});