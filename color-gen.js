'use strict';

/*
 * We use the JSON from https://github.com/shuhei/material-colors to generate our CSS-file.
 */

var cm = require('color');
var colors = require('./colors.json');

var allKeys = [];
var darkKeys = [];

Object.keys(colors).forEach(function(c) {
	if(typeof colors[c] != 'object') return;

	Object.keys(colors[c]).forEach(function(v) {
		var color = cm(colors[c][v]);
		var text = color.light() ? '#000' : '#fff';

		var selector = '.fill-' + c + '-' + v;
		allKeys.push(selector);
		if(color.dark()) {
			darkKeys.push(selector);
		}

		if(v == '500') {
			var s2 = '.fill-' + c;
			selector += ', ' + s2;
			allKeys.push(s2);
			if(color.dark()) {
				allKeys.push(s2);
			}
		}

		let style = selector + ' { background-color: ' + color.hexString() + '; color: ' + text + '; }';
		console.log(style);
	});
});

console.log('@custom-selector :--colored ' + allKeys.join(',') + ';');
console.log('@custom-selector :--colored-dark ' + darkKeys.join(',') + ';');
