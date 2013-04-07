var frisby = require('frisby'),
    server = 'http://localhost:3000/';
var db = require('../../src/db');

var db_name = db.db_name;
var fixtures_mod = require('pow-mongodb-fixtures');
var fixtures = null;


var md5_string1 = 'a3e5b97ee2b0d6a2b73a4c92e303af83',
    md5_string2 = 'b3e5b97ee2b0d6a2b73a4c92e303af81',
    md5_string3 = 'c3e5b97ee2b0d6a2b73a4c92e303af80',
    position = 1.1;

function setup(done) {
    // setup test database
    fixtures.clear(function (err) {
        fixtures.load({
            mybooks: [
                {
                    _id: db.create_id(md5_string1),
                    position: position
                }
            ]
        }, done);
    });
}

describe('', function () {
    beforeEach(function (done) {
        fixtures = fixtures_mod.connect(db_name);
        setup(done);
    });
    afterEach(function (done) {
        fixtures.close(done);
    });
    it('', function (done) {
        frisby.create('Get my books')
            .get(server + 'mybooks')
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON([{
                id: md5_string1,
                position: position
            }])
            .expectJSONTypes([{
                id: String,
                position: Number
            }])
            .toss();
        frisby.create('Add my books')
            .post(server + 'mybooks', {id: md5_string2, position: 1.1})
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON([{
                id: md5_string2,
                position: position
            }])
            .expectJSONTypes([{
                id: String,
                position: Number
            }])
            .toss();
        frisby.create('Update my book')
            .put(server + 'mybooks/' + md5_string2,
                 {position: 1.1})
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON({updated: 1})
            .expectJSONTypes({updated: Number})
            .toss();
        frisby.create('Delete my book')
            .delete(server + 'mybooks/' + md5_string2, {})
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON({deleted: 1})
            .expectJSONTypes({deleted: Number})
            .toss();
        frisby.create('Delete my book that doesn\'t exist')
            .delete(server + 'mybooks/' + md5_string3, {})
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSON({deleted: 0})
            .expectJSONTypes({deleted: Number})
            .toss();
        done();
    });
});


