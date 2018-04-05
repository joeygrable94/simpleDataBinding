/*
http://robdodson.me/javascript-design-patterns-observer/
https://www.joezimjs.com/javascript/javascript-design-patterns-observer/
https://www.safaribooksonline.com/library/view/learning-javascript-design/9781449334840/ch09s05.html
https://www.safaribooksonline.com/library/view/learning-javascript-design/9781449334840/ch09s06.html
https://bumbu.github.io/javascript-observer-publish-subscribe-pattern/
*/

// MEDIATOR CLASS
class Mediator {
	// constructor
	constructor() {
		// types of handlers
		this.handlers = {
			all: []		// runs on all actions
		}
	};
	// add a f(x) handler to the Mediator
	on(type, fn, context=this) {
		type = type || "all";
		fn = typeof fn === "function" ? fn: context[fn];

		console.log(fn);
		console.log(type);

		if (typeof this.handlers[type] === "undefined") {
			this.handlers[type] = [];
		}
		this.handlers[type].push({ fn: fn, context: context });
	};
	// remove a f(x) handler from the Mediator
	remove(type, fn, context=this) {
		try {
			this._getHandlers("remove", type, fn, context);
		} catch(error) {
			console.warn(error);
		}
	};
	// act on a handler type, passing along any supplied data
	act(type, data) {
		try {
			this._getHandlers("act", type, data);
		} catch(error) {
			console.warn(error);
		}
	};
	// returns the f(x) handlers for a specific Mediator type
	_getHandlers(action, type, arg, context=this) {
		type = type || "all";
		let handlers = this.handlers[type];
		for (let i = 0; handlers && i < handlers.length; i++) {
			switch (action) {
				case "act":
					handlers[i].fn.call(handlers[i].context, arg);
					break;
				case "remove":
					if (handlers[i].fn === arg && handlers[i].context === context) {
						handlers.splice(i,1);
					} else {
						throw "Mediator._getHandlers => not a valid handler action";
					}
					break;
				default:
					throw "invalid handler action";
					break;
			}
		}
	};
};




// initiate Mediator
let Mediate = new Mediator();
// create listeners|handler f(x) to execute on an update
function handleLogin(userdata) {
	// expects a userdata object to be passed to it
	console.log(userdata.username, 'logged in!');
}
// add the handlers to a certain Mediator type
Mediate.on("login", handleLogin);

// Elaborate user login process...
let isLoggedIn = false;
for (let u = 0; u < 100; u++) {
	// 100 users try to log in
	console.log("User #" + u + " tried to log in");
	// only user #65 is allowed to log in
	isLoggedIn = (u == 66) ? true : false;
	// check if user #65 is logged in
	if (isLoggedIn) {
		// act on login handler, passing a user data object
		Mediate.act("login", { username: "Jim Bob" });
	}
}

console.log(Mediate);




