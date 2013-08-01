/*
jQuery Blink
Author: WonderGroup, Jordan Thomas
URL: http://labs.wondergroup.com/demos/mini-ui/index.html
License: MIT (http://en.wikipedia.org/wiki/MIT_License)
*/
$.fn.blink = function(config) {
    _.defaults(config, {
        speed: 100,
        blinks: 2
    });
	
    var deferred = $.Deferred()
    var callsRemaining = 0
    var speed = config.speed

    function nextBlink() {
        callsRemaining--
        if (callsRemaining <= 0)
            deferred.resolve()
    }

    for (var i = config.blinks; i > 0; i--) {
        this
            .animate({
                opacity: 0
            }, speed)
            .animate({
                opacity: 1
            }, speed, nextBlink)
    }

    return deferred
};
