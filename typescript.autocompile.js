/*
Reference: https://github.com/niutech/typescript-compile
*/

(function() {
    var PROMISES_BY_SRC = {};

    $('script[type="text/typescript"]').each(function(i,script) {
        var src = $(script).attr('src');
        var deferred = $.Deferred();
        PROMISES_BY_SRC[src] = deferred.promise();
        $.get(src).done(function(tsCode) {
            var outfile = {
                source: '',
                Write: function(s) {
                    this.source += s;
                },
                WriteLine: function(s) {
                    this.source += s + '\n';
                },
                Close: function() {}
            };

            var compiler = new TypeScript.TypeScriptCompiler(outfile);
            compiler.parser.errorRecovery = true;
            compiler.setErrorCallback(function(start, len, message, block) {
                console.warn('Compilation error: ', message, '\n Code block: ', block, ' Start position: ', start, ' Length: ', len);
            });
            compiler.addUnit(tsCode, src);
            compiler.emit(false, function createFile(fileName) {
                return outfile;
            });
            $('<script>').text(outfile.source).appendTo('body');
            deferred.resolve();
        });
    });
    window.needTypescript = function() {
        var proceed = _.last(arguments),
            srcFiles = _.initial(arguments);

        var count = srcFiles.length;
        _.each(srcFiles, function() {
            PROMISES_BY_SRC[srcFiles].done(function() {
                count--;
                if (count === 0)
                    proceed();
            });
        });
    }
})();
