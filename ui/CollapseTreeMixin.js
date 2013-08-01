function CollapseTreeMixin(me) {
	me.openNode = function(path) {
		me.$childrenElement(path).show()
	}
	me.closeNode = function(path) {
		me.$childrenElement(path).hide()
	}
	me.toggleNode = function(path) {
		me.$childrenElement(path).toggle()
	}

	me.on('click', '.node-type-folder.node-icon, .node-type-folder.node-label', function(event) {
        var $node = $(this).closest('[data-tree-path]')
		me.toggleNode($node.data('tree-path'))
	})
}
