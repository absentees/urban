import $ from 'jquery';
import Hashids from 'hashids';

$(document).ready(function () {

	var hashids = new Hashids('mrpoopybutthole', 10, 'abcdefghijklmnopqrstuvwxyz1234567890');
	console.log(hashids.encode(0));

});
