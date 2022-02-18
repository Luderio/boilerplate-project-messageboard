'use strict';

const { Message, Reply } = require("../models");


module.exports = function (app) {

  app.route('/api/threads/:board')

    .post(function (request, response) {
      //object containing the form data from front-end.
      let { board, text, delete_password } = request.body;

      // if the board from the form is empty.
      if (!board || board === '') {
        board = request.params.board;
      }

      // constructs the database model, saved the data to database and redirects the page to the created board/thread. 
      let NewMessage = new Message({ board, text, delete_password });
      NewMessage.created_on = new Date()
      NewMessage.bumped_on = new Date()
      NewMessage.reported = false;
      NewMessage.replies = [];

      console.log(NewMessage)

      NewMessage.save((error, savedMessage) => {
        if (!error && savedMessage) {
          //response.redirect('/b/' + savedMessage.board + '/');
          return;
        }
      });
    })

    .get(function (request, response){
      let board = request.params.board;

      Message.find({board: board})
      .sort({bumped_on: 'desc'})
      .limit(10)
      .select('-delete_password -reported')
      .lean()
      .exec((error, arrayOfThreads) => {
        if (!error && arrayOfThreads) {
          
          arrayOfThreads.forEach((thread) => {

            thread['replycount'] = thread.replies.length;
            thread.replies.sort((thread1, thread2) => {
              return thread2.created_on - thread1.created_on;
            });

            thread.replies = thread.replies.slice(0, 3);

            thread.replies.forEach((reply) => {
              reply.delete_password = undefined;
              reply.reported = undefined;
            });
          });

          return response.json(arrayOfThreads)
        }
      });
    })

    .delete(function (request, response) {

      Message.findById(
        request.body.thread_id,
        (error, threadToDelete) => {
          if (!error && threadToDelete) {

            if (threadToDelete.delete_password === request.body.delete_password) {

              Message.findByIdAndRemove(
                request.body.thread_id,
                (error, deletedThread) => {
                  if (!error && deletedThread) {
                    return response.send('success');
                  }
                }
              );
            }else {
              return response.send('incorrect password');
            }

          }
        }
      );
    })

    .put(function (request, response) {

      Message.findByIdAndUpdate(
        request.body.thread_id,
        {reported: true},
        {new: true},
        (error, updatedThread) => {
          if (!error && updatedThread) {
            console.log(updatedThread)
            return response.send('reported');
          }
        }
      );
    })

    //-----------------------------------------
    
  app.route('/api/replies/:board')

    .post(function (request, response) {
      //object containing the form data from front-end.
      let { thread_id, text, delete_password } = request.body;


      // constructs the database model, and save the data to database.
      let newReply = new Reply({ text, delete_password });
      newReply.created_on = new Date().toUTCString();
      newReply.reported = false;

      Message.findByIdAndUpdate(
        thread_id, 
        {$push: {replies: newReply}, bumped_on: new Date().toUTCString()},
        {new: true},
        (error, updatedThread) => {
          if (!error && updatedThread) {
            return response.redirect('/b/' + updatedThread.board + '/' + updatedThread.id);
          }
        }
        );
    })

    .get(function (request, response) {
      let threadID = request.query.thread_id;

      Message.findById(
        threadID, 
        (error, thread) => {
          if (!error && thread) {
            thread.delete_password = undefined;
            thread.reported = undefined;

            thread['replycount'] = thread.replies.length;

            thread.replies.sort((thread1, thread2) => {
              return thread2.created_on - thread1.created_on;
            });

            thread.replies.forEach((reply) => {
              reply.delete_password = undefined;
              reply.reported = undefined;
            });

            return response.json(thread);
          

          }
        }
      );

    })

    .delete(function (request, response) {

      Message.findById(
        request.body.thread_id,
        (error, replyToDelete) => {
          if (!error && replyToDelete) {

            let i;
            for (i = 0; i < replyToDelete.replies.length; i++) {
              if (replyToDelete.replies[i].id === request.body.reply_id) {
                if (replyToDelete.replies[i].delete_password === request.body.delete_password) {
                  replyToDelete.replies[i].text = '[deleted]';
                }else {
                  return response.send('incorrect password');
                }
              }
            }

            replyToDelete.save((error, updatedThread) => {
              if (!error && updatedThread) {
                return response.send('success');
              }
            });

          }
        }
      );

    })


    .put(function (request, response) {

      Message.findById(
        request.body.thread_id,
        (error, replyToReport) => {
          if (!error && replyToReport) {

            let i;
            for (i = 0; i < replyToReport.replies.length; i++) {
              if (replyToReport.replies[i].id === request.body.reply_id) {
                replyToReport.replies[i].reported = true;
              }
            }

            replyToReport.save((error, updatedThread) => {
              if (!error && updatedThread) {
                console.log(updatedThread)
                return response.send('reported');
              }
            });
          }
        }
      );
    })
};


//USED TO DROP RECORDS ON THE DATABASE/
/*Message.remove({}, (error, result) => {
  if (error) return console.log(error);
  console.log(result);
});*/