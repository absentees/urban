import $ from 'jquery';
import Hashids from 'hashids';

$(document).ready(function () {

	var hashids = new Hashids('mrpoopybutthole', 10, 'abcdefghijklmnopqrstuvwxyz1234567890');
	var $nextLink = $('.next-link');

	var count = $nextLink.attr('data-count');
	var next = Math.floor(Math.random() * count) + 1;

	$nextLink.attr('href', '/' + hashids.encode(next));
});
