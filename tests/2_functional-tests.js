const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

//variables to be used as input for the test cases.
    let testMessageId;
    let testReplyId;
    let testDeletePassword = 'test_delete_pass';
    //let testBoard;


suite('Functional Tests', function() {

    suite('POST: Functional Tests', function() {

        //Creating a new thread: POST request to /api/threads/{board}
        test('POST: Creating a new thread', function(done) {
            chai.request(server)
                .post('/api/threads/test')
                .send({
                    board: 'Functional Test Thread',
                    text: 'Thread Text',
                    delete_password: testDeletePassword
                })
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    assert.equal(response.body.board, 'Functional Test Thread');
                    assert.equal(response.body.text, 'Thread Text');
                    assert.equal(response.body.delete_password, testDeletePassword)
                    testMessageId = response.body._id;
                    console.log("===========================")
                    console.log(testMessageId)
                    done();
                });
        }).timeout(10000)

        //Creating a new reply: POST request to /api/replies/{board}
        test('POST: Creating a new reply on a Thread', function(done) {
            chai.request(server)
                .post('/api/replies/test')
                .send({
                    thread_id: testMessageId,
                    text: 'Test Reply from Functional Test',
                    delete_password: testDeletePassword
                })
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    assert.equal(response.body.replies[0].text, 'Test Reply from Functional Test');
                    assert.equal(response.body.replies[0].delete_password, testDeletePassword);
                    testReplyId = response.body.replies[0]._id
                    console.log("===========================")
                    console.log(testReplyId)
                    done();
                });
        });

    });

    //=======================================================================================

    suite('GET: Functional Tests', function() {

        //Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}
        test('GET Threads from a board', function(done) {
            chai.request(server)
                .get('/api/threads/test')
                .send()
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    assert.isArray(response.body);
                    assert.isUndefined(response.body[0]);
                    done();
                });
        });
    
        //Viewing a single thread with all replies: GET request to /api/replies/{board}
        test('Get replies on a Thread', function(done) {
            chai.request(server)
                .get('/api/replies/test')
                .query({thread_id: testMessageId})
                .send()
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    let thread = response.body;
                    assert.equal(thread._id, testMessageId);
                    assert.isUndefined(thread.delete_password);
                    assert.isArray(thread.replies);
                    done();
                });
        });
    });

    //=======================================================================================

    suite('PUT: Functional Tests', function() {

        //Reporting a thread: PUT request to /api/threads/{board}
        test('Report a thread', function(done) {
            chai.request(server)
                .put('/api/threads/test')
                .send({
                    board: 'Functional Test Thread',
                    report_id: testMessageId
                })
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    done();
                });
        });
    
        //Reporting a reply: PUT request to /api/replies/{board}
        test('Report a reply on a Thread', function(done) {
            chai.request(server)
                .put('/api/replies/test')
                .query({report_id: testMessageId})
                .send({
                    thread_id: testMessageId,
                    reply_id: testReplyId
                })
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    done();
                });
        });

    });

    //=======================================================================================

    suite('DELETE: Functional Tests', function() {
        //DELETE REPLY WITH INCORRECT PASSWORD

        //Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password
        test('DELETE replies on a Thread with incorrect password', function(done) {
            chai.request(server)
                .delete('/api/replies/test')
                .query({thread_id: testMessageId})
                .send({
                    thread_id: testMessageId,
                    reply_id: testReplyId,
                    delete_password: 'invalid'
                })
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    done();
                });
        });

        //Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password
        test('DELETE a Thread with incorrect password', function(done) {
            chai.request(server)
                .delete('/api/threads/test')
                .send({
                    thread_id: testMessageId,
                    delete_password: 'invalid'
                })
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    done();
                });
        });

        //DELETE REPLY WITH CORRECT PASSWORD
        
        //Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password
        test('DELETE replies on a Thread', function(done) {
            chai.request(server)
                .delete('/api/replies/test')
                .query({thread_id: testMessageId})
                .send({
                    thread_id: testMessageId,
                    reply_id: testReplyId,
                    delete_password: testDeletePassword
                })
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    done();
                });
        });

        //Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password
        test('DELETE a Thread', function(done) {
            chai.request(server)
                .delete('/api/threads/test')
                .send({
                    thread_id: testMessageId,
                    delete_password: testDeletePassword
                })
                .end(function(error, response) {
                    assert.equal(response.status, 200);
                    done();
                });
        });

    });



    

    

});


