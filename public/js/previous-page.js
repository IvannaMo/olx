document.getElementById("back-button").addEventListener("click", function() {
    if (document.referrer) {
      window.history.back();
    }
    else {
      window.location.href = "/";
    }
});  