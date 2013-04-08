var express = require('express');
var routes = require('./routes');


function main() {
    var app = express();
    app.use(express.bodyParser());

    routes.setup(app);

    app.listen(3000);

    console.log('Listening on port 3000...');
}

main();
