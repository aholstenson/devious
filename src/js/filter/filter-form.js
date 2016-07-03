'use strict';

import ce from 'mara/ce';

import formApi from 'mara/forms/api';

/**
 * Define a filter form for use with ds-filterable. This form is mostly a copy
 * from mara-form. Instead of submitting the form it redirects it to the
 * filterable.
 */
ce.define('ds-filter-form', function(def) {
	def.createdCallback = function() {
		this.changeListener = this.changeListener.bind(this);
	};

	def.attachedCallback = function() {
		let p = this.parentNode;
		while(p) {
			if(p.hasPageState) {
				p.addPageState(this);
				break;
			}

			p = p.parentNode;
		}
	};

	def.domReadyCallback = function() {
		// Create the wrapping form
		this.wrapper = document.createElement('form');
		this.wrapper.addEventListener('submit', e => {
			e.preventDefault();
			e.stopImmediatePropagation();
			this.submit();
		});

		while(this.firstChild) {
			this.wrapper.appendChild(this.firstChild);
		}

		this.appendChild(this.wrapper);

		// Create the hidden form that will actually be used
		this.form = document.createElement('form');
		this.form.style.display = 'none';
		this.form.method = this.method || 'POST';
		this.form.action = this.action || document.location.toString();
		this.form.enctype = this.enctype || 'application/x-www-form-urlencoded';

		var i = document.createElement('input');
		i.setAttribute('type', 'hidden');
		i.setAttribute('name', 'data');
		this.form.appendChild(i);

		this.appendChild(this.form);

		if(this.hasAttribute('live')) {
			this.updateLiveMode(true);
		}
	};

	def.defineAttribute('method', function(oldValue, newValue) {
		this.form.method = newValue || 'POST';
	});

	def.defineAttribute('action', function(oldValue, newValue) {
		this.form.action = newValue || document.location.toString();
	});

	def.defineAttribute('enctype', function(oldValue, newValue) {
		this.form.enctype = newValue;
	});

	def.defineAttribute('live', function(oldValue, newValue) {
		this.updateLiveMode(newValue !== null);
	});

	formApi.section(def);

	// Setup page state
	def.getPageState = def.toData;
	def.setPageState = def.fromData;

	// Custom submit function
	def.submit = function() {
		var data = this.toData();

		this._lastSubmitted = this.form.elements[0].value = JSON.stringify(data);

		let forFilterable = this.getAttribute('for');
		let filterable = forFilterable ? document.getElementById(filterable) : document.query('ds-filterable');

		filterable.updateFilterFrom(this.form, (newForm) => {
			if(! newForm) return;
			
			// Our form layout may have changed
			this.replaceWith(newForm);
		});
	};

	def.updateLiveMode = function(live) {
		if(live) {
			this.addEventListener('change', this.changeListener);
		} else {
			this.removeEventListener('change', this.changeListener);
		}
	};

	def.changeListener = function(e) {
		// Quick hack to make sure we don't submit several times in a row
		let data = this.toData();
		if(JSON.stringify(data) == this._lastSubmitted) return;

		this.submit();
	};
});
