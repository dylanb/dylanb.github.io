jQuery(document).ready(function () {
  jQuery('td').each(function(index, value) {
    var descText = jQuery('li.' + value.className).text();
    if(descText.length) {
      jQuery(value).attr('aria-label', descText);
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
  jQuery('td a').each(function (index, item) {
    var $item = jQuery(item);
    var role = $item.find('span').text().replace('-', '');
    $item.attr({
      'target': 'aria-1.1',
      'href': window.waiBase + '#' + role
    });
  });
});
