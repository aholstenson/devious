'use strict';

import ce from 'mara/ce';
import events from 'mara/events';

ce.define('ds-filterable', function(def) {

	def.updateFilterFrom = function(form, cb) {
		let href = form.action || document.location.toString();

		let method = form.method ? form.method.toUpperCase() : 'GET';
		let data = formSerialize(form);

		let target =  method == 'GET' ? href + '?' + data : href;

		events.trigger(document, 'filterNavigateStarted', {
			filterable: this
		});

		let self = this;
		let req = new XMLHttpRequest();
		req.onload = function() { self._loadDone(this, cb); };
		req.onerror = this._loadError.bind(this);
		req.open(method, target, true);
		req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		req.setRequestHeader('X-Partial', 'true');
		if(method == 'GET') {
			req.send();
		} else {
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			req.send(data);
		}
	};

	def._loadDone = function(req, cb) {
		if(req.status < 200 || req.status > 299) {
			this._loadError();
		}

		let html = req.responseText
			.replace(/<\!DOCTYPE[^>]*>/i, '')
			.replace(/<(html|head|body|title|script)([\s\>])/gi,'<div class="document-$1"$2')
			.replace(/<(meta)([\s\>])/gi,'<div class="document-$1"$2</div>')
			.replace(/<\/(html|head|body|title|script)\>/gi,'</div>');

		let newDoc = document.createElement('div');
		newDoc.innerHTML = html;

		let newContent = newDoc.querySelector('ds-filterable');
		if(! newContent) return; // TODO: How do we handle this error?

		// TODO: Do we support more than one filter form?
		if(cb) {
			let form = newDoc.querySelector('ds-filter-form');
			cb(form);
		}

		// Empty ourselves and adopt new content
		while(this.firstChild) {
			this.firstChild.remove();
		}

		while(newContent.firstChild) {
			this.appendChild(newContent.firstChild);
		}

		events.trigger(document, 'filterNavigateDone', {
			filterable: this
		});
	};

	def._loadError = function() {
		events.trigger(document, 'filterNavigateError', {
			filterable: this
		});
	};
});

function formSerialize(form) {
	if(! form || form.nodeName !== 'FORM') return;

	let result = [];
	let push = function(el, value) {
		result.push(el.name + '=' + encodeURIComponent(value || el.value));
	};

	for(let i=0, n=form.elements.length; i<n; i++) {
		let el = form.elements[i];
		if(el.name === '') continue;

		switch(el.nodeName) {
			case 'INPUT':
				switch(el.type) {
					case 'checkbox':
					case 'radio':
						if(el.checked) push(el);
						break;
					default:
						push(el);
				}
				break;
			case 'TEXTAREA':
				push(el);
				break;
			case 'SELECT':
				switch(el.type) {
					case 'select-one':
						push(el);
						break;
					case 'select-multiple':
						for(var j=0, m=el.options.length; j<m; j++) {
							push(el, el.options[j].value);
						}
						break;
				}
				break;
			case 'BUTTON':
				switch(el.type) {
					case 'reset':
					case 'submit':
					case 'button':
						push(el.val);
				}
				break;
		}
	}

	return result.join('&');
}
