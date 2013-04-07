var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    db = null,
    db_name = 'bookien';

/*

module.exports.populateDB = function (db) {

    var books = [
        {
            name: 'book1',
            position: 0.0
        }, {
            name: 'book2',
            position: 0.0
        }
    ];

    db.collection('mybooks', function (err, collection) {
        collection.insert(books, {safe: true}, function (err, result) {});
    });

};     */

function init_db(name, cb) {
    var server = new Server('localhost', 27017, {auto_reconnect: true});
    db = new Db(name || db_name, server, {safe: false});

    db.open(function (err) {
        if (err) {
            console.log("Error while connecting to database");
        }
        cb();
    });
}

module.exports.close_db = function () {
    db.close();
};

module.exports.init_db = init_db;

module.exports.get_db = function () {
    if (!db) {
        init_db(null, function () {});
    }
    return db;
};

module.exports.create_id = function (hex_string) {
    try {
        return new mongo.Binary(
            new Buffer(hex_string, 'hex'),
            BSON.BSON_BINARY_SUBTYPE_MD5
        );
    } catch (e) {
        return null;
    }
};
module.exports.decode_id = function (binary) {
    return binary.toString('hex');
};

module.exports.db_name = db_name;