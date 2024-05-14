const database = {
  "phishingKeywords": ["phish", "trycloudflare", "login", "secure", "verify", "account", "update", "admin", "support", "bank", "paypal", "irs", "amazon", "google", "microsoft", "apple", "facebook", "instagram", "twitter", "linkedin", "yahoo", "netflix", "ebay", "chase", "wellsfargo", "citibank", "americanexpress", "att", "verizon", "paypal", "dhl", "fedex", "ups", "usps", "icloud", "dropbox", "onedrive", "snapchat", "spotify", "pinterest", "reddit", "twitch", "discord", "steam", "wordpress", "github", "bitbucket", "docker", "slack", "zoom", "moodle", "webex", "jira", "trello"],
  "phishingUrls": [
    {
      "url": "example.com/phishing",
      "category": ["phishing"]
    },
    {
      "url": "http://news.fangsforum.com/view/613d383671436065c8febf8cebc99ef2/public/index.php/",
      "category": ["suspicious"]
    },
    {
      "url": "http://login.facebook.confirmation.verify.account.suspiciousexample.com/",
      "category": ["social media", "verification"]
    },
    {
      "url": "http://secure.appleid.verify.phishing-url.com/",
      "category": ["phishing", "verification"]
    },
    {
      "url": "http://signin.microsoft.com-verifyaccount.login.verification.accountupdate.systemsupport.com/",
      "category": ["phishing", "verification", "support"]
    },
    // Add more URLs with categories/tags
  ],
  "phishingPatterns": [
    {
      "name": "Fake Login Page",
      "pattern": "/login.php",
      "description": "Common path for phishing login pages"
    },
    {
      "name": "Account Verification",
      "pattern": "/verify",
      "description": "Common path for phishing account verification pages"
    },
    {
      "name": "Suspicious Subdomain",
      "pattern": "//suspicious.example.com/",
      "description": "Subdomain commonly used for phishing"
    },
    {
      "name": "Misleading Path",
      "pattern": "/update/account",
      "description": "Misleading path for phishing updates"
    },
    {
      "name": "Fake Support Page",
      "pattern": "/support/",
      "description": "Common path for fake support pages"
    },
    {
      "name": "Phishing Parameter",
      "pattern": "phishing=1",
      "description": "Parameter indicating phishing in the URL"
    },
    {
      "name": "Malicious JavaScript",
      "pattern": "malicious.js",
      "description": "Malicious JavaScript file often used in phishing"
    },
    {
      "name": "Fake Bank Login",
      "pattern": "/banklogin.php",
      "description": "Fake bank login page"
    },
    {
      "name": "Fake PayPal Page",
      "pattern": "/paypal/login",
      "description": "Fake PayPal login page"
    },
    {
      "name": "IRS Phishing",
      "pattern": "/irs/login",
      "description": "Phishing page mimicking IRS login"
    },
    {
      "name": "Fake Amazon Page",
      "pattern": "/amazon/login",
      "description": "Fake Amazon login page"
    },
    {
      "name": "Fake Google Page",
      "pattern": "/google/login",
      "description": "Fake Google login page"
    },
    {
      "name": "Fake Microsoft Page",
      "pattern": "/microsoft/login",
      "description": "Fake Microsoft login page"
    },
    {
      "name": "Fake Apple Page",
      "pattern": "/apple/login",
      "description": "Fake Apple login page"
    },
    {
      "name": "Fake Facebook Page",
      "pattern": "/facebook/login",
      "description": "Fake Facebook login page"
    },
    {
      "name": "Fake Instagram Page",
      "pattern": "/instagram/login",
      "description": "Fake Instagram login page"
    },
    {
      "name": "Fake Twitter Page",
      "pattern": "/twitter/login",
      "description": "Fake Twitter login page"
    },
    {
      "name": "Fake LinkedIn Page",
      "pattern": "/linkedin/login",
      "description": "Fake LinkedIn login page"
    },
    {
      "name": "Fake Yahoo Page",
      "pattern": "/yahoo/login",
      "description": "Fake Yahoo login page"
    },
    {
      "name": "Fake Netflix Page",
      "pattern": "/netflix/login",
      "description": "Fake Netflix login page"
    },
    {
      "name": "Fake eBay Page",
      "pattern": "/ebay/login",
      "description": "Fake eBay login page"
    },
    {
      "name": "Fake Chase Page",
      "pattern": "/chase/login",
      "description": "Fake Chase login page"
    },
    {
      "name": "Fake Wells Fargo Page",
      "pattern": "/wellsfargo/login",
      "description": "Fake Wells Fargo login page"
    }
    // Ensure all patterns are included
  ]
};

// Sample function to retrieve URLs by category
function getUrlsByCategory(category) {
  return database.phishingUrls.filter(url => url.category.includes(category));
}

// Sample usage
const phishingUrls = getUrlsByCategory("phishing");
console.log("Phishing URLs:", phishingUrls);
