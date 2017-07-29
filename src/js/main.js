import $ from 'jquery';
import Hashids from 'hashids';

$(document).ready(function () {

	var hashids = new Hashids('mrpoopybutthole', 10, 'abcdefghijklmnopqrstuvwxyz1234567890');
	var $nextLink = $('.next-link');

	var collection = hashids.decode($nextLink.attr('data-id'));

	var next = Math.round(Math.random()*collection[1]);
	console.log(next);

	$nextLink.attr('href', '/' + hashids.encode(next, collection[1]));
});
