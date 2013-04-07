var mongo = require('mongodb');
var db = require('./db');

function decode_id(result) {
    if (result._id !== undefined) {
        result.id = db.decode_id(result._id);
        delete result._id;
    }
}

function send_action_result(err, results, cb) {
    var response = null, i, result;
    if (!err && results !== null) {
        for (i = results.length - 1; i >= 0; i -= 1) {
            result = results[i];
            decode_id(result);
        }
        decode_id(results);
        response = JSON.stringify(results);
    } else if (results === null) {
        response = JSON.stringify({error: {code: 1, name: "NotFound"}});
    } else {
        response = JSON.stringify({'error': {code: err.code, name: err.name}});
    }
    cb(response);
}

module.exports.get_my_books = function (request, cb) {
    db.get_db().collection('mybooks', function (err, collection) {
        collection.find().toArray(function (err, items) {
            send_action_result(err, items, cb);
        });
    });
};

module.exports.get_my_book = function (request, cb) {
    var id;
    id = db.create_id(request.params.id);
    if (id !== null) {
        db.get_db().collection('mybooks', function (err, collection) {
            collection.findOne({'_id': id}, function (err, item) {
                send_action_result(err, item, cb);
            });
        });
    } else {
        send_action_result({code: 2, name: "InvalidId"}, {}, cb);
    }
};

module.exports.add_my_book = function (request, cb) {
    if (request.body) {
        var book = request.body;
        if (book.id) {
            book._id = db.create_id(book.id.toString());
            book.position = parseFloat(book.position);
            delete book.id;
            if (book._id) {
                db.get_db().collection('mybooks', function (err, collection) {
                    collection.insert(book, {safe: true}, function (err, result) {
                        send_action_result(err, result, cb);
                    });
                });
            } else {
                send_action_result({code: 3, name: "InvalidParams", description: "id is invalid"}, {}, cb);
            }
        } else {
            send_action_result({code: 3, name: "InvalidParams", description: "id is empty"}, {}, cb);
        }
    } else {
        send_action_result({code: 3, name: "InvalidParams", description: "no body"}, {}, cb);
    }
};

module.exports.update_my_book = function (request, cb) {
    var request_body = request.body,
        book = {position: request_body.position},
        id = db.create_id(request.params.id);
    db.get_db().collection('mybooks', function (err, collection) {
        collection.update(
            {'_id': id},
            book,
            {safe: true},
            function (err, result) {
                send_action_result(err, {'updated': result}, cb);
            }
        );
    });
};

module.exports.delete_my_book = function (request, cb) {
    var id = db.create_id(request.params.id);
    db.get_db().collection('mybooks', function (err, collection) {
        collection.remove({'_id': id}, {safe: true}, function (err, result) {
            send_action_result(err, {'deleted': result }, cb);
        });
    });
};
