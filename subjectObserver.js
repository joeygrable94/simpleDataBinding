"use strict";
/*

SUBJECTS assess and notify OBSERVERS of any data changes


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
	constructor(value, context) {
		// provided scope or window
		this.context = context || window;
		// data handlers | observers | watchers
		this.observers = [];
		// assess data
		this.value = this.assess(value);
		// return subjects value
		return this;
	};
	// assess the value of the data
	assess(data) {
		// TODO: implement a deep search to check if two objects or arrays are the EXACT same??
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
			observer.call(this.context, newData);
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





// OBSERVER
class Observer {
	// constructor
	constructor(dependencies, handler) {
		// initial value
		let value = new Subject(handler());
		// register this handler for each dependency
		let listener = () => value.assess(handler());
		dependencies.forEach((dependency) => {
			dependency.subscribe(listener);
		});
		// restrict from manually updating Observer value
		let getter = () => value;
		getter.subscribe = value.subscribe;
		return getter();
	};
}





// bind value
function bindInputToNumber(element, subject) {
	// set element value
	let initial = subject.value;
	// 
	if (element.tagName != "INPUT") {
		element.innerHTML = initial;
		subject.subscribe(() => { element.innerHTML = subject.value; });
	} else {
		// bind the subject to the element
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
		// assess the converted value
		let newValue = convert(event.target.value);
		subject.assess(newValue);
	});
};





// AUTO-RUN
(function() {

	// OBSERVER CLASS
	let h = new Subject(3);
	let g = new Subject(5);
	let funk = function() { return h.value + g.value; }
	let k = new Observer([h,g], funk);
	console.log(h.value);
	console.log(g.value);
	console.log(k.value);



	// SUBJECTS => Numbers, Strings & Boolines
	let a = new Subject(3);
	let b = new Subject(2);
	let addValues = function() { return a.value + b.value; };
	let c = new Observer([a,b], addValues);
	// initial Subject state
	console.log(a.value);
	console.log(b.value);
	console.log(c.value);
	// Subject state changes
	a.assess(9);
	// all subscribed Subject handlers are updated
	console.log(c.value);



	// SUBJECTS => Arrays
	let testArray = [1,2,3];
	let x = new Subject(testArray);
	let y = new Subject([4,5]);
	let z = new Observer([x, y], function() { return x.value.concat(y.value); });
	// initial Array state
	console.log(x.value);
	console.log(y.value);
	console.log(z.value);
	// Array state changes
	y.assess([6,7,8]);
	// all subscribed Array's are automatically updated
	console.log(z.value);



	// SUBJECTS => Objects
	let user1 = {name: "Jane"};
	let user2 = {name: "Bob"};
	let u1 = new Subject(user1);
	let u2 = new Subject(user2);
	let isSameUser = function() { return (u1.value.name === u2.value.name) ? "same user" : "different user"; };
	let checkUser = new Observer([u1, u2], isSameUser);
	// initial Obj state
	console.log(u1.value);
	console.log(u2.value);
	console.log(checkUser.value);
	// Obj state changes
	u2.assess({name: "Jane"});
	// all subscribed Obj are automatically updated
	console.log(checkUser.value);



	// VIEW | ACTIONS
	// get DOM elements to bind
	var aText = document.querySelectorAll(".aText");
	var bText = document.querySelectorAll(".bText");
	var cText = document.querySelectorAll(".cText");	
	// bind SUBJECT values to DOM elements
	aText.forEach((element, index) => { bindInputToNumber(element, a); });
	bText.forEach((element, index) => { bindInputToNumber(element, b); });
	cText.forEach((element, index) => { bindInputToNumber(element, c); });

})();


