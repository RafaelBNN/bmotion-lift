var bms = bms || {};
var angular = angular || {};

(function() {
    bms = window.parent.bmsapi(window.frameElement.getAttribute('sessionId'), window.frameElement.getAttribute('viewId'));
    angular = window.parent.angular;
})();

// observer that changes the current floor text
bms.observe("formula", {
    selector: "#txt_cur_floor", // txt_cur_floor is the id of thecurrent flor text in the svg image
    formulas: ["cur_floor"], // list of observed formulas (?). Maybe cur_floor is a variable of the abstract machine?
    trigger: function (origin, values) {  	// the origin parameter holds a reference to the graphical element it is attached to,
                                        	// and values contains the values of the defined formulas
    origin.text(values[0])  // in this case, here we change the value of the selector based on the formula index 0 (cur_floor)
    }
});

// observer to change color and position of lift door
bms.observe("formula", {
	selector: "#door",
	formulas: ["cur_floor", "door_open"],
	trigger: function (origin, values) {
		
		switch (values[0]) { // values[0] corresponds to cur_floor
			case "0":
				origin.attr("y", "175");
				break;
			case "1":
				origin.attr("y", "60");
				break;
			case "-1":
				origin.attr("y", "275");
				break;
		}
		
		if(values[1] === "TRUE") { // values[1] corresponds to door_open
			origin.attr("fill", "white");
		} 
		else {
		origin.attr("fill", "lightgray");
		}
		
	}
});

// event handler that allows to use floor labels as buttons to call machine operations
bms.executeEvent({
	selector: "text[data-floor]", // notice here we dont have the # before the id
	events: [
	  	{
			name: "push_call_button", 
			predicate: function (origin) {
		  		return "b=" + origin.attr("data-floor")
			}
		}
	]
});

// event handler that allows to click door to call open and close operations
bms.executeEvent({
	selector: "#door",
	events: [
		{ name: "close_door" }, 
		{ name: "open_door" }
	]
  });