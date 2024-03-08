document.addEventListener('DOMContentLoaded', function() {
    var checkUrlButton = document.getElementById('checkUrl');
    checkUrlButton.addEventListener('click', function() {
        var urlInput = document.getElementById('urlInput').value;
        if (urlInput) {
            // Assuming you have a function to check the URL for phishing
            checkForPhishing(urlInput, function(phishingDetected) {
                var resultDiv = document.getElementById('result');
                resultDiv.textContent = phishingDetected ? 'Phishing Detected!' : 'No Phishing Detected';
            });
        }
    }, false);
}, false);

function checkForPhishing(urlParts) {
    // Check if the hostname part of the URL consists only of numbers and dots
    var onlyNumbersDetected = /^[0-9.]+$/.test(urlParts.hostname);

    // Check if the URL contains the string 'phish'
    var characterDetected = urlParts.href.includes('phish');

    // Checks for typosquatting or similar-looking domain names
    var googleLikeDetected = /.*g[^\/]*o[^\/]*o[^\/]*g[^\/]*l[^\/]*e.*/.test(urlParts.hostname);
    var facebookLikeDetected = /.*f[^\/]*a[^\/]*c[^\/]*e[^\/]*b[^\/]*o[^\/]*o[^\/]*k.*/.test(urlParts.hostname);
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

