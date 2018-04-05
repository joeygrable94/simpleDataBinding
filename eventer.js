"use strict";
/*

EVENTER.js
- a function that dynamically binds events and event handlers to DOM elements

Author:
	@JoeyGrable94
 */





// Eventer CLASS
class Eventer {
	// construct event handler obj
	constructor(handlers={}, start=true) {
		// elements to bind
		this.toBind = document.querySelectorAll("[data-bind]");
		// obj containing all the event actions
		this.handlers = handlers;
		// if initated
		if (start) { this.init(); }
		return this;
	};
	// bind event actions to DOM elements
	bindEvents() {
		// for each element
		this.toBind.forEach((element, index) => {
			// get variables
			let eventElm = element,
				handler = eventElm.getAttribute("data-bind"),
				eventType = eventElm.getAttribute("data-event") || "click",
				binded = eventElm.getAttribute("data-binded");
			// chech for the event handler in the handlers obj
			if (typeof this.handlers[handler] !== undefined) {
				// if not already bound
				if (!binded) {
					// bind each event to element
					eventType = eventType.split("|");
					for (let i = 0; i < eventType.length; i++) {
						eventElm.setAttribute("data-binded", "true");
						eventElm.addEventListener(eventType[i], this.handlers[handler]);
					}
				}
			}
		});
	};
	// initiate event binding
	init() { return this.bindEvents(); };
};





// AUTO-RUN
(function() {

	// EVENTER
	let eventer = new Eventer({
		clickHandler: function(event) {
			console.log("clicked", event);
		},
		hoverHandler: function(event) {
			console.log("hover", event);
		},
		keyupHandler: function(event) {
			console.log("keyup", event);
		}
	});

})();


