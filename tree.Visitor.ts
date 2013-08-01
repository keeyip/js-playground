///<reference path="ts-definitions/DefinitelyTyped/underscore/underscore.d.ts"/>
class Visitor {
	private path : Array;
	
	static DO_NOT_DESCEND = {};
	static SKIP_NEXT_SIBLINGS = {};
	
	constructor() {
		this.path = []
	}
	
	getCurrentPath() {
		return _.clone(this.path)
	}
	
	visit(node, enter, leave, key) {
		if (!key)
			this.path = []
		
		var enterResult = enter.call(this, node, key)
		if (enterResult !== Visitor.DO_NOT_DESCEND) {
			if (this.canDescend(node, key)) {
				var childKeys = this.getKeys(node),
					childKey,
					childVisitResult
				for (var i = 0, n = childKeys.length; i < n; i++) {
					childKey = childKeys[i]
					
					this.path.push(childKey)
					childVisitResult = this.visit(node[childKey], enter, leave, childKey)
					this.path.pop()
					
					if (childVisitResult === Visitor.SKIP_NEXT_SIBLINGS) break
				}
			}
		}
		
		leave.call(this, node, key)
		return enterResult
	}
	
	canDescend(node, key) {
		return _.isArray(node) || _.isObject(node)
	}
	
	getKeys(node) {
		var keys
		if (_.isArray(node)) {
			keys = _.keys(node)
		} else if (_.isObject(node)) {
			keys = _.keys(node)
			keys.sort(this.getComparatorForObjectKeys(node))
		} else {
			throw 'Visitor#getKeys(<em>node</em>), <em>node</em> must be an array or an object'
		}
		
		return keys
	}
	
	getComparatorForObjectKeys(object) {
        var self = this
		return function (a,b) {
			var aOrder = self.getOrderForObjectKey(object, a),
				bOrder = self.getOrderForObjectKey(object, b)
				
			if (aOrder > bOrder) return 1
			if (aOrder < bOrder) return -1
			
			if (a > b) return 1
			if (a < b) return -1
			return 0
		}
	}

    // NOTE: __cachedOrderFns is an implementation detail of #getOrderForObjectKey
    // This is a class-level member only so that the compiler can
    // warn about any usage of this member outside of this class
    private __cachedOrderFns : Array;

    // @return order [-orderFns.length, (orderFns.length + 2) or Infinity]
	getOrderForObjectKey(object, key) : Number {
		if (!this.__cachedOrderFns) {
			this.__cachedOrderFns = [
				_.isBoolean, _.isNumber, _.isDate, _.isString,
				_.isObject, _.isArray, _.isFunction
			]
		}
		
		var orderFns = this.__cachedOrderFns
		
		if (key === 'constructor') return orderFns.length + 2
		if (key === 'prototype')   return orderFns.length + 1
		if (key === '__proto')     return orderFns.length

        var offset = 0;

        if (/^[^a-zA-Z]/.test(key)) {
            offset = -orderFns.length;
        }
		
		for (var i = 0, n = orderFns.length; i < n; i++) {
			if (orderFns[i].call(_, object[key]))
				return offset + i
		}
		
		return Infinity
	}
}
