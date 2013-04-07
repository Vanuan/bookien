var cov = '';
if (process.env.NODE_COV == 1) {
    cov = '-cov';
}

var books = require('../src' + cov + '/books');
var db = require('../src' + cov + '/db');

var assert = require("assert");
var fixtures_mod = require('pow-mongodb-fixtures');
var mongo = require('mongodb');

var md5_string1 = 'a3e5b97ee2b0d6a2b73a4c92e303af83';
var md5_string2 = 'b3e5b97ee2b0d6a2b73a4c92e303af81';

var db_name = db.db_name;
var fixtures = fixtures_mod.connect(db_name);

module.exports = {
    beforeEach: function (done) {
        require('../src/db').init_db(db_name, function () {
            fixtures.clear(function (err) {
                fixtures.load({
                    mybooks: [
                        {
                            _id: db.create_id(md5_string1),
                            position: 1.1
                        }
                    ]
                }, done);
            });
        }); // setup test database
    },
    'test_get_my_book': function (done) {
        books.get_my_book(
            {
                params: {id: md5_string1}
            },
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    {
                        id: md5_string1,
                        position: 1.1
                    });
                done();
            }
        );
    },
    'test_get_non_existing_my_book': function (done) {
        books.get_my_book(
            {
                params: {id: 'aaff'}
            },
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    {
                        error: {
                            code: 1,
                            name: "NotFound"
                        }
                    });
                done();
            }
        );
    },
    'test_get_garbage_my_book': function (done) {
        books.get_my_book(
            {
                params: {id: 'garbage'}
            },
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    {
                        error: {
                            code: 2,
                            name: "InvalidId"
                        }
                    });
                done();
            }
        );
    },
    'test_get_my_books': function (done) {
        books.get_my_books(
            {},
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    [
                        {
                            id: md5_string1,
                            position: 1.1
                        }
                    ]);
                done();
            }
        );
    },
    'test_add_existing_my_book': function (done) {
        books.add_my_book(
            {
                body: {
                    id: md5_string1,
                    position: 1.1
                }
            },
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    {
                        error: {
                            code: 11000,
                            name: "MongoError"
                        }
                    });
                done();
            }
        );
    },
    'test_null_add_my_book': function (done) {
        books.add_my_book(
            {
                body: {}
            },
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    {error: {code: 3, name: "InvalidParams"}});
                done();
            }
        );
    },
    'test_undefined_add_my_book': function (done) {
        books.add_my_book(
            {},
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    {error: {code: 3, name: "InvalidParams"}});
                done();
            }
        );
    },
    'test_add_new_my_book': function (done) {
        books.add_my_book(
            {body: {id: md5_string2, position: 50.49}},
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    [{id: md5_string2, position: 50.49}]);
                books.get_my_books(
                    {},
                    function (response) {
                        assert.deepEqual(JSON.parse(response),
                            [
                                {
                                    id: md5_string1,
                                    position: 1.1
                                },
                                {
                                    id: md5_string2,
                                    position: 50.49
                                }
                            ]);
                        done();
                    }
                );
            }
        );
    },
    'test_update_my_book': function (done) {
        books.update_my_book(
            {
                params: {id: md5_string1},
                body: {position: 50.49}
            },
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    {
                        updated: 1
                    });
                books.get_my_books(
                    {},
                    function (response) {
                        assert.deepEqual(JSON.parse(response),
                            [
                                {
                                    id: md5_string1,
                                    position: 50.49
                                }
                            ]);
                        done();
                    }
                );
            }
        );
    },
    'test_delete_my_book': function (done) {
        books.delete_my_book(
            {params: {id: md5_string1}},
            function (response) {
                assert.deepEqual(JSON.parse(response),
                    {
                        deleted: 1
                    });
                books.get_my_books(
                    {},
                    function (response) {
                        assert.equal(response, '[]');
                        done();
                    }
                );
            }
        );
    }
};

