'use strict';
let $doc = $(document),
    input = 'input';

$doc.on('focusin', input, function() {
    $(this).addClass('cur');
}).on('focusout', input, function() {
    $(input).removeClass('cur');
});