document.addEventListener('DOMContentLoaded', function() {
  var goBackButton = document.getElementById('goBack');

  goBackButton.addEventListener('click', function() {
    // Navigate back to popup.html
    window.location.href = 'popup.html';
  });
});
