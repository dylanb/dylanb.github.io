jQuery(document).ready(function () {
  jQuery('#legend li').each(function(index, value) {
    var $this = jQuery(value);
    $this.attr('id', $this.attr('class'));
  });
  jQuery('td').each(function(index, value) {
    if (value.className !== 'invisible') {
      jQuery(value).attr('aria-labelledby', value.className);
    }
  });
  var base = 'http://www.w3.org/TR/wai-aria';
  var $modal = jQuery('#modal');
  var lastfocus;
  var links;

  jQuery('td a').on('click', function (e) {
    console.log(e.target);
    lastfocus = document.activeElement;
    var $this = jQuery(this);
    var text = $this.text();
    var $popup = jQuery('#popup');

    text = text.replace(/-/gi, '');
    text = text.replace(/aria/, 'aria-');
    $popup
      .load( window.waiBase + ' #' + text, undefined,
        function() {
          $popup.find('a').each(function(index, item) {
            var newHref = item.href.replace(window.location.origin, base);
            item.setAttribute('href', newHref);
            item.setAttribute('target', '_blank');
          });
          $modal.show();
          jQuery('#close').focus();
          links = $modal.find('button, a');
        });
  });
  jQuery('#close').on('click', function () {
    $modal.hide();
    lastfocus.focus();
  });
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
});
