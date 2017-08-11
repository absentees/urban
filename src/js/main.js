import $ from 'jquery';
import Hashids from 'hashids';
import Clipboard from 'clipboard';

$(document).ready(function () {

	$('.copy-url').text(window.location);

	var clipboard = new Clipboard('.copy-button');
	clipboard.on('success', function () {
		$('.copied').show();
 		$('.copied').fadeOut(1000);
	});

	var hashids = new Hashids('mrpoopybutthole', 10, 'abcdefghijklmnopqrstuvwxyz1234567890');
	var $nextLink = $('.next-link');

	var count = $nextLink.attr('data-count');
	var next = Math.floor(Math.random() * count) + 1;

	$nextLink.attr('href', '/' + hashids.encode(next));
});
