class Visitor {
	private path;
	
	static DO_NOT_DESCEND = 1;
	static SKIP_NEXT_SIBLINGS = 2;
	
	constructor() {
		this.path = []
	}
	
	getCurrentPath() {
		return _.clone(this.path)
	}
	
	visit(node, enter, leave, key) {
		if (!key)
			this.path = []
		
		var enterResult = enter(node, key)
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
		
		leave(node, key)
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
			throw 'Visitor#getKeys(node), node must be an array or an object'
		}
		
		return keys
	}
	
	getComparatorForObjectKeys(object) {
		return => (a,b) {
			var aOrder = this.getOrderForObjectKey(object, a),
				bOrder = this.getOrderForObjectKey(object, b)
				
			if (aOrder > bOrder) return 1
			if (aOrder < bOrder) return -1
			return 0
		}
	}
	
	getOrderForObjectKey(object, key) {
		if (key === 'constructor') return -4
		if (key === 'prototype') return -3
		if (key === '__proto') return -2
		if (/^[^a-zA-Z]/.test(key)) return -1
		
		if (!this.__cachedOrderFns) {
			this.__cachedOrder = [
				_.isBoolean, _.isNumber, _.isDate, _.isString,
				_.isObject, _.isArray, _.isFunction
			]
		}
		
		var orderFns = this.__cachedOrderFns
		for (var i = 0, n = orderFns.length; i < n; i++) {
			if (orderFns[i].call(_, object[key]))
				return i
		}
		
		return Infinity
	}
}
