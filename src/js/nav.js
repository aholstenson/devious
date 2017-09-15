'use strict';

import { HTMLCustomElement, InitialRender, define } from 'mara/ce';

define('ds-nav-selector', class NavSelector extends HTMLCustomElement.with(InitialRender) {

	initialRenderCallback() {
		super.initialRenderCallback();

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
	}

});
