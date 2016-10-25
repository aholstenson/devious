'use strict';

/*
 * We use the JSON from https://github.com/shuhei/material-colors to generate our CSS-file.
 */

var cm = require('color');
var colors = require('./colors.json');

var allKeys = [];
var darkKeys = [];

function outputFillColor(name, color) {
	color = cm(color);
	var text = color.light() ? '#000' : '#fff';

	allKeys.push(name);
	if(color.dark()) {
		darkKeys.push(name);
	}

	let style = name  + ' { background-color: ' + color.hexString() + '; color: ' + text + '; }';
	console.log(style);
}

function outputColor(name, color) {
	color = cm(color);
	let style = name  + ' { color: ' + color.hexString() + '; }';
	console.log(style);
}

Object.keys(colors).forEach(function(c) {
	if(typeof colors[c] != 'object') {
		outputFillColor('.fill-' + c, colors[c]);
		outputColor('.' + c, colors[c]);
	} else {
		Object.keys(colors[c]).forEach(function(v) {
			var fill = '.fill-' + c + '-' + v;
			if(v == '500') {
				fill += ', .fill-' + c;
			}

			var normal = '.' + c + '-' + v;
			if(v == '500') {
				fill += ', .' + c;
			}

			outputFillColor(fill, colors[c][v]);
			outputColor(normal, colors[c][v]);
		});
	}
});

console.log('@custom-selector :--colored ' + allKeys.join(',') + ';');
console.log('@custom-selector :--colored-dark ' + darkKeys.join(',') + ';');
