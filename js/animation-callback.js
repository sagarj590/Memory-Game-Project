//*function for css animations and transitions.*
const ANIMCALLBACK = (function () {
	const whichTransitionEvent = function () {
		var t,
				el = document.createElement("fakeelement");

		var transitions = {
			"transition"      : "transitionend",
			"OTransition"     : "oTransitionEnd",
			"MozTransition"   : "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		}

		for (t in transitions){
			if (el.style[t] !== undefined){
				return transitions[t];
			}
		}
	}
	
	const whichAnimationEvent = function () { 
		var t,
				el = document.createElement("fakeelement");

		var animations = {
			"animation"      : "animationend",
			"OAnimation"     : "oAnimationEnd",
			"MozAnimation"   : "animationend",
			"WebkitAnimation": "webkitAnimationEnd"
		}

		for (t in animations){
			if (el.style[t] !== undefined){
				return animations[t];
			}
		}
	};
	
	return {
		whichTransitionEvent: whichTransitionEvent,
		whichAnimationEvent: whichAnimationEvent
	};
	
}());