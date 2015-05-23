var preStyles = {
 "line-height": "1.4",
 "font-family": "Monaco, 'Courier New', Courier",
 "font-size": "0.75em",
 "border-top-style": "solid",
 "border-right-style": "solid",
 "border-bottom-style": "solid",
 "border-left-style": "solid",
 "border-top-width": "1px",
 "border-right-width": "1px",
 "border-bottom-width": "1px",
 "border-left-width": "1px",
 "border-top-color": "rgb(153, 153, 153)",
 "border-right-color": "rgb(153, 153, 153)",
 "border-bottom-color": "rgb(153, 153, 153)",
 "border-left-color": "rgb(153, 153, 153)",
 "border-image-source": "initial",
 "border-image-slice": "initial",
 "border-image-width": "initial",
 "border-image-outset": "initial",
 "border-image-repeat": "initial",
 "background-color": "rgb(252, 252, 252)",
 "margin-top": "1em",
 "margin-right": "0px",
 "margin-bottom": "1em",
 "margin-left": "0px",
 "padding-top": "0.5em",
 "padding-right": "0.8em",
 "padding-bottom": "0.5em",
 "padding-left": "0.8em",
 "overflow-x":"scroll"
};

jQuery(document).ready(function () {
  jQuery('td').each(function(index, value) {
    var descText = jQuery('li.' + value.className).text();
    if(descText.length) {
      jQuery(value).attr('aria-label', descText);
    }
  });
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

          $popup.find('pre').css(preStyles);
          // Remove the details
          $popup.find('table').remove();

          // Make the links point to absolute addresses
          $popup.find('a').each(function(index, item) {
            var newHref;
            if (item.getAttribute('href').charAt(0) === '#') {
              newHref = window.waiBase + item.getAttribute('href');
            } else {
              newHref = item.href.replace(window.location.origin, window.waiBase);
            }
            console.log(item.getAttribute('href'), ', ', item.href, ', ', newHref, ', ', window.location.origin);
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
