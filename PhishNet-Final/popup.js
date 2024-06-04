document.addEventListener('DOMContentLoaded', function() {
  const viewHistoryButton = document.getElementById('viewHistory');
  const detectCustomPhishingButton = document.getElementById('detectCustomPhishing');
  const customUrlInput = document.getElementById('customUrl');
  const authenticateButton = document.getElementById('authenticateButton');
  const checkEmailButton = document.getElementById('checkEmailButton');

  sendMessageToContentScript();

  function sendMessageToContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'detect-phishing' }, function(response) {
          handleDetectionResult(document.getElementById('result'), response.result);
        });
      } else {
        handleError(document.getElementById('result'));
      }
    });
  }

  function handleDetectionResult(element, result) {
    element.innerHTML = `Phishing detected: ${result}`;
  }

  function handleError(element) {
    element.innerHTML = 'Error detecting phishing';
  }

  function detectPhishingForCustomUrl(url) {
    if (!url) {
      document.getElementById('customResult').innerHTML = 'Please enter a URL';
      return;
    }
    const urlParts = new URL(url);
    const phishingDetected = checkForPhishing(urlParts);

    if (phishingDetected) {
      document.getElementById('customResult').innerHTML = 'Phishing Detected!';
    } else {
      fetch(chrome.runtime.getURL('phishing_database.json'))
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch the local phishing database');
          }
          return response.json();
        })
        .then(phishingDatabase => {
          const databasePhishingDetected = isPhishing(urlParts.href, phishingDatabase);
          document.getElementById('customResult').innerHTML = databasePhishingDetected ? 'Phishing Detected!' : 'No Phishing Detected';
        })
        .catch(error => {
          console.error('Error:', error.message);
          document.getElementById('customResult').innerHTML = 'Error detecting phishing';
        });
    }
  }

  function checkForPhishing(urlParts) {
    const onlyNumbersDetected = /^[0-9.]+$/.test(urlParts.hostname);
    const characterDetected = urlParts.href.includes('phish');
    const googleLikeDetected = /.*g[^\/]*o[^\/]*o[^\/]*g[^\/]*l[^\/]*e.*/.test(urlParts.hostname);
    const facebookLikeDetected = /.*f[^\/]*a[^\/]*c[^\/]*e[^\/]*b[^\/]*o[^\/]*o[^\/]*k.*/.test(urlParts.hostname);
    const instagramLikeDetected = /.*i[^\/]*n[^\/]*s[^\/]*t[^\/]*a[^\/]*g[^\/]*r[^\/]*a[^\/]*m.*/.test(urlParts.hostname);
    const tiktokLikeDetected = /.*t[^\/]*i[^\/]*k[^\/]*t[^\/]*o[^\/]*k.*/.test(urlParts.hostname);
    const paypalLikeDetected = /.*p[^\/]*a[^\/]*y[^\/]*p[^\/]*a[^\/]*l.*/.test(urlParts.hostname);
    const excessiveHyphensDetected = (urlParts.hostname.match(/-/g) || []).length > 2;

    function containsMixedScripts(url) {
      const latinScriptRegex = /\p{Script=Latin}/u;
      const nonLatinScriptRegex = /[^\p{Script=Latin}\p{Punctuation}\p{Nd}]/u;
      const containsLatin = latinScriptRegex.test(url);
      const containsNonLatin = nonLatinScriptRegex.test(url);
      return containsLatin && containsNonLatin;
    }
    const mixedScriptDetected = containsMixedScripts(urlParts.hostname);

    return onlyNumbersDetected || characterDetected || googleLikeDetected || facebookLikeDetected ||
           instagramLikeDetected || tiktokLikeDetected || paypalLikeDetected || 
           excessiveHyphensDetected || mixedScriptDetected || !urlParts.href.startsWith('https://');
  }

  function isPhishing(url, phishingDatabase) {
    const { phishingKeywords, phishingUrls, phishingPatterns } = phishingDatabase;
    const keywordDetected = phishingKeywords.some(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(url);
    });

    if (keywordDetected) {
      console.log(`Keyword detected: ${url}`);
      return true;
    }

    const urlDetected = phishingUrls.some(phishingUrl => url.includes(phishingUrl));
    if (urlDetected) {
      console.log(`URL detected: ${url}`);
      return true;
    }

    const patternDetected = phishingPatterns.some(pattern => {
      const regex = new RegExp(pattern.pattern, 'i');
      return regex.test(url);
    });

    if (patternDetected) {
      console.log(`Pattern detected: ${url}`);
      return true;
    }

    return false;
  }

  detectCustomPhishingButton.addEventListener('click', function() {
    const customUrl = customUrlInput.value;
    detectPhishingForCustomUrl(customUrl);
  });

  viewHistoryButton.addEventListener('click', function() {
    window.location.href = 'history.html';
  });

  authenticateButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: 'openAuthPage' });
  });
  
  checkEmailButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getEmailSubject' }, function(response) {
          if (response && response.subject) {
            console.log('Email subject received:', response.subject);
            // Send the subject to the background script
            chrome.runtime.sendMessage({ action: 'sendSubjectToIndex', subject: response.subject });
          }
        });
      }
    });
  });
});