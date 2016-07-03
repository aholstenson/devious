'use strict';

import ce from 'mara/ce';

ce.define('ds-nav-selector', function(def) {

	def.createdCallback = function() {
		this.setAttribute('role', 'button');

		this.addEventListener('click', function(e) {
			e.preventDefault();

			let container = document.query(this.getAttribute('for'));
			if(! container) {
				console.log('ERROR Could not find element matching', this.getAttribute('for'));
				return;
			}

			if(container.classList.contains('+active')) {
				this.classList.remove('+active');
				container.classList.remove('+active');
			} else {
				this.classList.add('+active');
				container.classList.add('+active');
			}
		});
	};

});
