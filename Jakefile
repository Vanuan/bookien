desc("Run jake test and jake lint");
task('default', ['test:spec', 'test:no-cov'], {async:true}, function(){
});

namespace('test', function() {
    exec_task({
        name: 'no-cov',
        desc: 'Run tests without coverage',
        commands: ['mocha -R list -u exports test']
    });
    exec_task({
        name: 'spec',
        desc: 'Run spec tests',
        commands: ['jasmine-node spec']
    });
    exec_task({
        name: 'cov',
        desc: 'Run tests with coverage',
        commands: ['jscoverage --no-highlight src src-cov',
                   'NODE_COV=1 mocha -R html-cov -u exports test > coverage.html',
                   'gnome-open coverage.html'
                  ]
    });
});

exec_task({
    name: 'lint',
    desc: 'Run js lint',
    commands: ['mocha -R list -u exports test']
});

var print_opts = {
        printStdout: true, printStderr: true
    };

function exec(command, cb) {
    if (!cb) {
        cb = complete;
    }
    jake.exec(command, cb, print_opts);
}

var forEachAsync = require('forEachAsync');

function exec_task(task_spec) {
    desc(task_spec.desc);
    task(task_spec.name, {async: true}, function(args) {
        forEachAsync(task_spec.commands, function(next, command) {
            exec(command, function() { next(); });
        }).then(complete);
    });
}

