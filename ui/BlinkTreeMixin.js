function BlinkTreeMixin(me) {
	me.blinkNode = function(path) {
		return me.$nodeElement(path).find('.node-label').blink({})
	}
}
