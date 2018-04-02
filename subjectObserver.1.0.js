"use strict";
/*

SUBJECTS that Access and Notify OBSERVERS of any data changes


Author:
	@JoeyGrable94
Sources:
	(subject-observer pattern) http://www.dofactory.com/javascript/observer-design-pattern
	(ES6 auto bind events with data-attribute) https://gist.github.com/tkh44/4495846
	(ES6 classes) https://googlechrome.github.io/samples/classes-es6/
	(ES6 arrow functions) https://codeburst.io/javascript-arrow-functions-for-beginners-926947fc0cdc
	(JS apply, call, bind) https://stackoverflow.com/questions/15455009/javascript-call-apply-vs-bind

-----

SUBJECTS
	- maintains list of observers (any number of Observer objects may observe a Subject)
	- lets observer objects subscribe or unsubscribe
	- notifies observers when this subject's state changes
OBSERVERS
	- a function that can be invoked when Subject changes (i.e. event occurs)

 */



// SUBJECT CLASS
class Subject {
	// constructor
	constructor(value, scope=window) {
		// provided scope or window
		this.scope = scope;
		// data handlers | observers | watchers
		this.observers = [];
		// access data
		this.value = this.access(value);
		// return subjects value
		return this;
	};
	// access the value of the data
	access(data) {
		// TODO: implement a deep search to check if two objects or arrays are the same
		//console.log("new data: ", data !== this.value);
		// if a value provided and/or is different from the existing value
		if (arguments.length && data !== this.value) {
			// update the subject value
			this.value = data;
			// notify observer with data
			this.notify(data);
		}
		// return this data
		return this.value;
	};
	// notify watchers of any updates
	notify(newData) {
		// loop through data handlers
		this.observers.forEach((observer) => {
			// call observer f(x) on this & input data
			observer.call(this.scope, newData);
		});
	};
	// subscribe a function to watch data
	subscribe(fn) {
		// add input f(x) to handlers array
		this.observers.push(fn);
	};
	// unsubscribe a function that watches data
	unsubscribe(fn) {
		// filter handlers
		this.observers = this.observers.filter((observer) => {
			// keep all observers f(x) that are not the input f(x)
			observer !== fn;
		});
	};
};



// OBSERVER CLASS
class Observer {
	// construct event handler obj
	constructor(start=false) {
		// elements to bind
		this.toBind = document.querySelectorAll("[data-bind]");
		// obj containing all the event actions
		this.observers = {
			clickHandler: function(event) {
				console.log("clicked", event);
			},
			keyupHandler: function(event) {
				console.log("keyup", event);
			}
		};
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
				observer = eventElm.getAttribute("data-bind"),
				eventType = eventElm.getAttribute("data-event") || "click",
				binded = eventElm.getAttribute("data-binded");
			// chech for the event handlers in the observers obj
			if (typeof this.observers[observer] !== undefined) {
				// if not already bound
				if (!binded) {
					// bind event to element
					eventElm.setAttribute("data-binded", "true");
					eventElm.addEventListener(eventType, this.observers[observer]);
				}
			}
		});
	};
	// initiate event binding
	init() { return this.bindEvents(); };
};



// bind value
function bindInputToNumber(element, subject) {
	// set element value
	let initial = subject.value;
	// 
	if (element.tagName != "INPUT") {
		element.innerHTML = initial;
		subject.subscribe(() => { element.innerHTML = subject.value; });
	} else {
		// bind the subject to observer
		element.value = initial;
		subject.subscribe(() => { element.value = subject.value; });
	}
	// convert input string to a number to compute with
	let convert = function(v) { return v; };
	if (typeof initial == "number") {
		convert = function (n) { return isNaN(n = parseFloat(n)) ? 0 : n; };
	};
	// listen to DOM changes
	element.addEventListener("input", (event) => {
		// access the converted value
		let newValue = convert(event.target.value);
		subject.access(newValue);
	});
};



// compute with dependencies
function compute(dependencies, callHandler) {
	// initial value
	let value = new Subject(callHandler());
	// register a listener for each dependency, that accesses the updated value
	let listener = function() { return value.access(callHandler()); };
	dependencies.forEach((dependency) => {
		dependency.subscribe(listener);
	});
	// wrap the value to restrict users from manually updating the value
	let getter = function() { return value; };
	getter.subscribe = value.subscribe;
	return getter();
};



// AUTO-RUN
(function() {

	// SUBJECTS
	let a = new Subject(3);
	let b = new Subject(2);
	let c = compute([a, b], function() {
		return a.value + b.value;
	});

	// OBSERVER
	let observer = new Observer(true);

	// VIEW | ACTIONS
	// get DOM elements to bind
	var aText = document.querySelectorAll(".aText");
	var bText = document.querySelectorAll(".bText");
	var cText = document.querySelectorAll(".cText");
	
	// bind SUBJECT values to DOM elements
	aText.forEach((element, index) => {
		bindInputToNumber(element, a);
	});
	bText.forEach((element, index) => {
		bindInputToNumber(element, b);
	});
	cText.forEach((element, index) => {
		bindInputToNumber(element, c);
	});


})();