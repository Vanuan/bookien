var books = require('./books');

function setup_route(app, method, path, object, func) {
    app[method](path, function onRequest(req, res) {
        object[func](req, function onResponse(json_response) {
            res.setHeader('Content-Type', 'application/json');
            res.send(json_response);
        });
    });
}

module.exports.setup = function setup(app) {
    setup_route(app, 'get', '/mybooks', books, 'get_my_books');
    setup_route(app, 'get', '/mybooks/:id', books, 'get_my_book');
    setup_route(app, 'post', '/mybooks', books, 'add_my_book');
    setup_route(app, 'put', '/mybooks/:id', books, 'update_my_book');
    setup_route(app, 'delete', '/mybooks/:id', books, 'delete_my_book');
};

