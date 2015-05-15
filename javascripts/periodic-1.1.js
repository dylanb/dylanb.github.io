jQuery(document).ready(function () {
  jQuery('td').each(function(index, value) {
    var descText = jQuery('li.' + value.className).text();
    if(descText.length) {
      jQuery(value).attr('aria-label', descText);
    }
  });
  var base = 'http://www.w3.org/TR/wai-aria';
  var $modal = jQuery('#modal');
  var lastfocus;
  var links;

  jQuery('td a').on('click', function (e) {
    lastfocus = document.activeElement;
    var $this = jQuery(this);
    var text = $this.text();
    var $popup = jQuery('#popup');
    var group = this.parentNode.className;

    // Hide the content behind the modal from the screen reader
    jQuery('[role="main"], footer').attr('aria-hidden', true)
      .find('a').attr('tabindex', '-1');

    // Remove the inserted hyphens
    text = text.replace(/-/gi, '');
    text = text.replace(/aria/, 'aria-');

    // Load the text from the spec (should come from the cache)
    $popup
      .load( window.waiBase + ' #' + text, undefined,
        function() {
          // Modify the heading
          $popup.find('.permalink').empty().append(
              jQuery('<a target="_blank" href="' + window.waiBase + '#' + text + '">spec</a>')
            );
          $popup.find('.type-indicator').text('(' + group + ')');

          // Remove the details
          $popup.find('table').remove();

          // Make the links point to absolute addresses
          $popup.find('a').each(function(index, item) {
            var newHref = item.href.replace(window.location.origin, base);
            item.setAttribute('href', newHref);
            item.setAttribute('target', '_blank');
          });
          $modal.show();
          jQuery('#close').focus();

          // Fetch the links for the tab circle management
          links = $modal.find('button, a');
        });
  });

  // Handle the closing of the modal
  jQuery('#close').on('click', function () {
    // Restore the content behind the modal
    jQuery('[role="main"], footer').attr('aria-hidden', false)
      .find('a').removeAttr('tabindex');

    $modal.hide();
    setTimeout(function () {
      // Timeout is needed so the focus actually goes to the last place
      lastfocus.focus();
    }, 100);
  });

  // Add keyboard handling for TAB circling
  $modal.on('keydown', function (e) {
    var cancel = false;
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    switch(e.which) {
      case 27: // ESC
        $modal.hide();
        lastfocus.focus();
        cancel = true;
        break;
      case 9: // TAB
        if (e.shiftKey) {
          if (e.target === links[0]) {
            links[links.length - 1].focus();
            cancel = true;
          }
        } else {
          if (e.target === links[links.length - 1]) {
            links[0].focus();
            cancel = true;
          }
        }
        break;
    }
    if (cancel) {
      e.preventDefault();
    }
  });

  // Event handlers to toggle between colors and patterns
  jQuery('[name="colpat"]').on('change', function (e) {
    var value = jQuery(this).val();
    switch(value) {
      case 'colors':
        jQuery(document.body).removeClass('patterns');
        break;
      case 'patterns':
        jQuery(document.body).addClass('patterns');
        break;
    }
  });

  // Cache the spec
  jQuery('#popup').load( window.waiBase + ' #text', undefined, function () {
    jQuery('#popup').text('cached');
  });
});
