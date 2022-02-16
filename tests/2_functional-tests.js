const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);



suite('Functional Tests', function() {

    //variables to be used as input for the test cases.
    let testMessageId;
    let testReplyId;
    let testDeletePassword = 'test_delete_pass';
    

     //Creating a new thread: POST request to /api/threads/{board}
     test('Creating a new thread', function(done) {
        chai.request(server)
            .post('/api/threads/test')
            .send({
                board: 'test',
                text: 'Functional Test Thread',
                delete_password: testDeletePassword
            })
            .end(function(error, response) {
                assert.equal(response.status, 200);
                let createdThreadId = response.redirects[0].split('/')[response.redirects[0].split('/').length - 1];
                testMessageId = createdThreadId;
                done();
            });
    });

    //Creating a new reply: POST request to /api/replies/{board}
    test('POST a reply on a Thread', function(done) {
        chai.request(server)
            .post('/api/replies/test')
            .send({
                thread_id: testMessageId,
                text: 'Test Reply from Functional Test',
                delete_password: testDeletePassword
            })
            .end(function(error, response) {
                assert.equal(response.status, 200);
                let createdReplyId = response.redirects[0].split('=')[response.redirects[0].split('=').length - 1];
                testReplyId = createdReplyId;
                done();
            });
    });


    test('GET Threads from a board', function(done) {
        chai.request(server)
            .get('/api/threads/test')
            .send()
            .end(function(error, response) {
                assert.equal(response.status, 200);
                assert.isArray(response.body);
                let firstThread = response.body[0];
                assert.isUndefined(firstThread.delete_password);
                assert.isAtMost(firstThread.replies.length, 3);
                done();
            });
    });

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

    test('Report a thread', function(done) {
        chai.request(server)
            .put('/api/threads/test')
            .send({
                thread_id: testMessageId
            })
            .end(function(error, response) {
                assert.equal(response.status, 200);
                assert.equal(response.body, 'success');
                done();
            });
    });

    test('Report a reply on a Thread', function(done) {
        chai.request(server)
            .put('/api/replies/test')
            .query({thread_id: testMessageId})
            .send({
                thread_id: testMessageId,
                reply_id: testReplyId
            })
            .end(function(error, response) {
                assert.equal(response.status, 200);
                assert.equal(response.body, 'success');
                done();
            });
    });

    //DELETE WITH INCORRECT PASSWORD

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
                assert.equal(response.body, 'success');
                done();
            });
    });

    test('DELETE a Thread with incorrect password', function(done) {
        chai.request(server)
            .delete('/api/threads/test')
            .send({
                thread_id: testMessageId,
                delete_password: 'invalid'
            })
            .end(function(error, response) {
                assert.equal(response.status, 200);
                assert.equal(response.body, 'incorrect password');
                done();
            });
    });

    //DELETE WITH CORRECT PASSWORD





    //Put other tests above this.
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
                assert.equal(response.body, 'success');
                done();
            });
    });


    //Put other tests above this.
    test('DELETE a Thread', function(done) {
        chai.request(server)
            .delete('/api/threads/test')
            .send({
                thread_id: testMessageId,
                delete_password: testDeletePassword
            })
            .end(function(error, response) {
                assert.equal(response.status, 200);
                assert.equal(response.body, 'success');
                done();
            });
    });


});


