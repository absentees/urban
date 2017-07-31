#!/usr/bin/env node

require('babel-polyfill');
require('dotenv').config();
var Xray = require('x-ray');
var x = Xray();
var jsonfile = require('jsonfile');
var file = './src/html/data/content.json';
var Hashids = require('hashids');
var hashids = new Hashids('mrpoopybutthole', 10, 'abcdefghijklmnopqrstuvwxyz1234567890');
var request = require('request');
var async = require('async');
var domainr = require('domainr-api');
var domainrApi = new domainr(process.env.DOMAINR_API);

function scrapeDictionary(callback) {
	x('http://www.urbandictionary.com/', '.def-panel', [{
			title: '.word',
			meaning: '.meaning',
			example: '.example'
		}])
		.paginate('#content > div.pagination-centered > ul > li:nth-child(7) > a@href')
		.limit(100)(function (err, obj) {
			if (err) {
				console.log(err);
			}

			for (var i = 0; i < obj.length; i++) {
				// Create domain
				// convert word to domainable string
				obj[i].title = obj[i].title.replace(/[^A-Za-z]/g, '').toLowerCase() + '.com';
				// Set ID
				obj[i].id = hashids.encode(i, obj.length);
				obj[i].available = 'is taken';
			}

			callback(null, obj);
		});

}

function checkDomains(domains, callback) {

	async.each(domains, function (domain, callback) {
		domainrApi
			.status([domain.title])
			.then(res => {
				console.log('Domain status: ' + domain.title + ' ' + res[0].summary);

				switch (res[0].summary) {
				case 'inactive':
					domain.available = "is available";
					break;
				case 'marketed':
					domain.available = "is for sale"
					break;
				}
				callback();
			})
			.catch(err => {
				console.log(err)
				callback();
			});
	}, function (err) {
		if (err) {
			console.log(err);
		}

		callback(null, domains);
	});
}

function writeToJson(words, callback) {
	jsonfile.writeFile(file, words, {
		spaces: 2
	}, function (err) {
		if (err) {
			console.error(err);
		}
	});
}

async.waterfall([
	scrapeDictionary,
	checkDomains,
	writeToJson
], function (err, words) {
	if (err) {
		console.log(`Something went wrong: ${err}`);
	}

	console.log(words);
});
