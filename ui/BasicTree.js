function BasicTree(attrs) {
	var me = this
	_.extend(me, {
		TREE_ELEMENT: '<ui-tree>',
		TREE_ROOT_ELEMENT: '<ui-tree-root>',
		TREE_NODE_ELEMENT: '<ui-tree-node>',
		TREE_CHILDREN_ELEMENT: '<ui-tree-children>',
		decorateNode$: function(node, $node) {
			return $node.append($('<span class="node-label">').text(node.label))
		}
	}, attrs)

	var $el = $(me.TREE_ELEMENT)
	
	function renderNode$(node, $parentNode) {
		_.defaults(node, {
			name: node.label
		})
		var nodeName = _.result(node, 'name')

		var $node = $($parentNode ? me.TREE_NODE_ELEMENT : me.TREE_ROOT_ELEMENT)
			.attr('data-tree-path', ($parentNode ? $parentNode.data('tree-path') : '') + encodeURIComponent(nodeName + '.'))
		me.decorateNode$(node, $node)

		if (!_.isEmpty(node.children)) {
			var $children = $(me.TREE_CHILDREN_ELEMENT)
				.attr('data-parent-tree-path', $node.data('tree-path'))
			_.each(node.children, function(childNode) {
				renderNode$(childNode, $node).appendTo($children)
			})
			$children.appendTo($node)
		}

		return $node
	}

	me.render$ = function() {
		var $temp = $('<div class="temp">')
		$el.replaceWith($temp)
			.html()

		renderNode$(me.rootNode, null).appendTo($el)

		$temp.replaceWith($el)

		return $el
	}

	me.$childrenElement = function(path) {
		return $el.find('[data-parent-tree-path="' + encodeURIComponent(path) + '"]').first()
	}

	me.$nodeElement = function(path) {
		return $el.find('[data-tree-path="' + encodeURIComponent(path) + '"]').first()
	}

	me.on = function(eventName, selector, handler) {
        $(document).on(eventName, selector, function(event) {
            if ($(this).closest($el).length === 0)
                return
            return handler.call(this, event)
        })
		return me
	}

    me.mixin = function() {
        _.each(arguments, function(mixin) {
            mixin(me)
        })
        return me
    }
}

