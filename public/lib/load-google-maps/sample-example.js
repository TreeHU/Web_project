$(elem).on("myevent", function() {
  $.when( loadGoogleMaps( 3, API_KEY, LANG, SENSOR ) )
    .then(function() { // or .done(...)
      !!google.maps // true
    });
});