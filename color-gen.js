'use strict';

/*
 * We use the JSON from https://github.com/shuhei/material-colors to generate our CSS-file.
 */

var cm = require('color');
var colors = require('./colors.json');

var allKeys = [];
var darkKeys = [];

function outputColor(name, color) {
	color = cm(color);
	var text = color.light() ? '#000' : '#fff';

	allKeys.push(name);
	if(color.dark()) {
		darkKeys.push(name);
	}

	let style = name  + ' { background-color: ' + color.hexString() + '; color: ' + text + '; }';
	console.log(style);
}

Object.keys(colors).forEach(function(c) {
	if(typeof colors[c] != 'object') {
		outputColor('.fill-' + c, colors[c]);
	} else {
		Object.keys(colors[c]).forEach(function(v) {
			var selector = '.fill-' + c + '-' + v;
			if(v == '500') {
				selector += ', .fill-' + c;
			}

			outputColor(selector, colors[c][v]);
		});
	}
});

console.log('@custom-selector :--colored ' + allKeys.join(',') + ';');
console.log('@custom-selector :--colored-dark ' + darkKeys.join(',') + ';');
