#!/usr/bin/env node

require('babel-polyfill');
require('dotenv').config();
var Xray = require('x-ray');
var x = Xray();
var jsonfile = require('jsonfile');
var file = './src/html/data/content.json';
var Hashids = require('hashids');
var hashids = new Hashids('mrpoopybutthole', 10, 'abcdefghijklmnopqrstuvwxyz1234567890');
var moment = require('moment');
var async = require('async');
var Airtable = require('airtable');
Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base(process.env.AIRTABLE_BASE_ID);

function getAirtableRecords(callback) {
	var records = [];

	base('Domains').select({
		view: "Grid view"
	}).eachPage(function page(airTableRecords, fetchNextPage) {
		airTableRecords.forEach(function (record) {
			records.push({
				id: hashids.encode(record.get('id')),
				title: record.get('title'),
				meaning: record.get('meaning'),
				example: record.get('example'),
				available: record.get('available'),
				dateChecked: record.get('dateChecked'),
				count: record.get('count')
			});
		});
		fetchNextPage();

	}, function done(err) {
		if (err) {
			console.log(`Something went wrong getting records: ${err}`);
		}

		return callback(null, records);
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
	getAirtableRecords,
	writeToJson
], function (err, words) {
	if (err) {
		console.log(`Something went wrong: ${err}`);
	}
});
